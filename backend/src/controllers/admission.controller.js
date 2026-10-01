const { pool } = require("../config/db");

// Create Admission Request (Staff only - role_id = 1)
const createAdmissionRequest = async (req, res, next) => {
  const client = await pool.connect();

  try {
    const userId = req.user.userId;

    const {
      patientName,
      age,
      gender,
      patientContactNo,
      emergencyContactNo,
      doctorId,
      expectedStayDuration,
      priorityId,
      diagnosis,
      wardId,
      bedTypeId,
    } = req.body;

    // Check if logged-in user is Staff (role_id = 1)
    const userQuery = "SELECT role_id FROM users WHERE id = $1";
    const userResult = await client.query(userQuery, [userId]);

    if (userResult.rows.length === 0 || Number(userResult.rows[0].role_id) !== 1) {
      return res.status(403).json({ error: "Forbidden: Only Staff can create admission requests" });
    }

    // Validate required fields
    if (!patientName || !age || !gender || !doctorId || !wardId || !bedTypeId || !priorityId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Start Transaction
    await client.query("BEGIN");

    // 1. Insert Patient
    const insertPatientQuery = `
      INSERT INTO patients (name, age, gender, patient_contact_no, emergency_contact_no)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    const patientValues = [patientName, age, gender, patientContactNo, emergencyContactNo];
    const patientResult = await client.query(insertPatientQuery, patientValues);
    const patientId = patientResult.rows[0].id;

    // 2. Insert Admission Request
    const insertRequestQuery = `
      INSERT INTO admission_requests (
        patient_id,
        doctor_id,
        ward_id,
        bed_type_id,
        priority_id,
        expected_stay_duration,
        diagnosis,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'PENDING')
      RETURNING id, status, requested_at
    `;
    const requestValues = [
      patientId,
      doctorId,
      wardId,
      bedTypeId,
      priorityId,
      expectedStayDuration || null,
      diagnosis || null,
    ];
    const requestResult = await client.query(insertRequestQuery, requestValues);
    const admissionRequestId = requestResult.rows[0].id;

    // 3. Log ADMISSION_CREATED to admission_history
    await client.query(
      `INSERT INTO admission_history
        (admission_request_id, patient_id, action, to_ward_id, performed_by, reason)
       VALUES ($1, $2, 'ADMISSION_CREATED', $3, $4, $5)`,
      [admissionRequestId, patientId, wardId, userId, diagnosis || null]
    );

    // Commit Transaction
    await client.query("COMMIT");

    res.status(201).json({
      message: "Admission request created successfully",
      patient_id: patientId,
      admission_request: requestResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
};

// Get Admission Requests for Logged-in Doctor
const getDoctorAdmissionRequests = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // 1. Find the doctor_id for the logged in user
    const doctorQuery = "SELECT id FROM doctors WHERE user_id = $1";
    const doctorResult = await pool.query(doctorQuery, [userId]);

    if (doctorResult.rows.length === 0) {
      return res.status(404).json({ error: "Logged in user is not a valid active doctor" });
    }

    const doctorId = doctorResult.rows[0].id;

    const requestsQuery = `
      SELECT
        ar.id, ar.expected_stay_duration, ar.diagnosis, ar.status, ar.rejection_reason, ar.requested_at,
        w.id as ward_id, w.name as ward_name,
        bt.id as bed_type_id, bt.name as bed_type_name,
        pt.id as priority_id, pt.name as priority_name,
        p.id as patient_id, p.name as patient_name, p.age as patient_age, p.gender as patient_gender,
        p.patient_contact_no, p.emergency_contact_no,
        u.name as doctor_name, d.specialisation as doctor_specialisation
      FROM admission_requests ar
      JOIN wards          w  ON ar.ward_id      = w.id
      JOIN bed_types      bt ON ar.bed_type_id  = bt.id
      JOIN priority_types pt ON ar.priority_id  = pt.id
      JOIN patients       p  ON ar.patient_id   = p.id
      JOIN doctors        d  ON ar.doctor_id    = d.id
      JOIN users          u  ON d.user_id       = u.id
      WHERE ar.doctor_id = $1
      ORDER BY ar.requested_at DESC
    `;

    const requestsResult = await pool.query(requestsQuery, [doctorId]);

    res.status(200).json({
      count: requestsResult.rowCount,
      admission_requests: requestsResult.rows,
    });
  } catch (error) {
    next(error);
  }
};

// Update Admission Request Status (Approve / Reject)
const updateAdmissionRequestStatus = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const requestId = req.params.id;
    const { status, rejection_reason } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status. Must be APPROVED or REJECTED" });
    }

    if (status === "REJECTED" && !rejection_reason) {
      return res.status(400).json({ error: "Rejection reason is required when rejecting a request" });
    }

    // 1. Find the doctor_id for the logged in user
    const doctorQuery = "SELECT id FROM doctors WHERE user_id = $1";
    const doctorResult = await pool.query(doctorQuery, [userId]);

    if (doctorResult.rows.length === 0) {
      return res.status(403).json({ error: "Forbidden: Only active doctors can perform this action" });
    }

    const doctorId = doctorResult.rows[0].id;

    // 2. Check if the request belongs to this doctor and is PENDING
    const checkQuery = "SELECT status FROM admission_requests WHERE id = $1 AND doctor_id = $2";
    const checkResult = await pool.query(checkQuery, [requestId, doctorId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Admission request not found or does not belong to you" });
    }

    if (checkResult.rows[0].status !== "PENDING") {
      return res.status(400).json({ error: `Cannot update request because it is already ${checkResult.rows[0].status}` });
    }

    // 3. Update the request
    const updateQuery = `
      UPDATE admission_requests
      SET 
        status = $1, 
        rejection_reason = $2, 
        responded_at = CURRENT_TIMESTAMP, 
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING id, status, rejection_reason, responded_at
    `;
    const updateValues = [status, status === "REJECTED" ? rejection_reason : null, requestId];

    const updateResult = await pool.query(updateQuery, updateValues);

    // Fetch patient_id and ward_id from request for history
    const reqDetailsResult = await pool.query(
      "SELECT patient_id, ward_id FROM admission_requests WHERE id = $1",
      [requestId]
    );
    const { patient_id: patientId, ward_id: wardId } = reqDetailsResult.rows[0];

    // Log DOCTOR_APPROVED or DOCTOR_REJECTED to admission_history
    const historyAction = status === "APPROVED" ? "DOCTOR_APPROVED" : "DOCTOR_REJECTED";
    await pool.query(
      `INSERT INTO admission_history
        (admission_request_id, patient_id, action, to_ward_id, performed_by, reason)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [requestId, patientId, historyAction, wardId, userId, status === "REJECTED" ? rejection_reason : null]
    );

    res.status(200).json({
      message: `Admission request ${status.toLowerCase()} successfully`,
      admission_request: updateResult.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// Get all APPROVED Admission Requests - Ward Manager only (role_id = 3)
const getApprovedAdmissionRequests = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Check if logged-in user is a Ward Manager (role_id = 3)
    const userCheck = await pool.query("SELECT role_id FROM users WHERE id = $1", [userId]);
    if (userCheck.rows.length === 0 || Number(userCheck.rows[0].role_id) !== 3) {
      return res.status(403).json({ error: "Forbidden: Only Ward Managers can view approved requests" });
    }

    // 1. Fetch all APPROVED admission requests with joined details
    const requestsQuery = `
      SELECT
        ar.id,
        ar.expected_stay_duration,
        ar.diagnosis,
        ar.status,
        ar.requested_at,
        ar.responded_at,
        w.id    AS ward_id,
        w.name  AS ward_name,
        bt.id   AS bed_type_id,
        bt.name AS bed_type_name,
        pt.id   AS priority_id,
        pt.name AS priority_name,
        p.id                   AS patient_id,
        p.name                 AS patient_name,
        ar.doctor_id AS doctor_id,
        u.name                 AS doctor_name
      FROM admission_requests ar
      JOIN wards          w  ON ar.ward_id      = w.id
      JOIN bed_types      bt ON ar.bed_type_id  = bt.id
      JOIN priority_types pt ON ar.priority_id  = pt.id
      JOIN patients       p  ON ar.patient_id   = p.id
      JOIN doctors        d  ON ar.doctor_id    = d.id
      JOIN users          u  ON d.user_id       = u.id
      WHERE ar.status = 'APPROVED'
      ORDER BY ar.responded_at DESC
    `;
    const requestsResult = await pool.query(requestsQuery);

    // 2. For each request, fetch available beds matching ward + bed_type
    const requests = await Promise.all(
      requestsResult.rows.map(async (row) => {
        const bedsQuery = `
          SELECT id, name, status
          FROM beds
          WHERE ward_id     = $1
            AND bed_type_id = $2
            AND status      = 'AVAILABLE'
            AND is_active   = TRUE
          ORDER BY name ASC
        `;
        const bedsResult = await pool.query(bedsQuery, [row.ward_id, row.bed_type_id]);
        return {
          ...row,
          available_beds: bedsResult.rows,
        };
      })
    );

    res.status(200).json({
      count: requests.length,
      admission_requests: requests,
    });
  } catch (error) {
    next(error);
  }
};

// Assign Bed (Ward Manager action)
const assignBed = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const userId = req.user.userId;
    const {
      admissionRequestId,
      bedId,
      patientId,
      wardId,
      attendingDoctorId,
      priorityId,
      expectedStayDuration,
      diagnosis,
    } = req.body;

    // 1. Validate required fields
    if (!admissionRequestId || !bedId || !patientId || !wardId || !attendingDoctorId || !priorityId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 2. Check if logged-in user is a Ward Manager (role_id = 3)
    const userQuery = "SELECT role_id FROM users WHERE id = $1 AND is_active = TRUE";
    const userResult = await client.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(403).json({ error: "User not found or inactive" });
    }
    if (Number(userResult.rows[0].role_id) !== 3) {
      return res.status(403).json({ error: "Forbidden: Only Ward Managers can assign beds" });
    }

    // 3. Check if the bed is AVAILABLE
    const bedQuery = "SELECT id, status FROM beds WHERE id = $1 AND is_active = TRUE";
    const bedResult = await client.query(bedQuery, [bedId]);

    if (bedResult.rows.length === 0) {
      return res.status(404).json({ error: "Bed not found" });
    }
    if (bedResult.rows[0].status !== "AVAILABLE") {
      return res.status(400).json({ error: `Bed is not available. Current status: ${bedResult.rows[0].status}` });
    }

    // 4. Check if admission_request is still APPROVED
    const reqCheckQuery = "SELECT status FROM admission_requests WHERE id = $1";
    const reqCheckResult = await client.query(reqCheckQuery, [admissionRequestId]);

    if (reqCheckResult.rows.length === 0) {
      return res.status(404).json({ error: "Admission request not found" });
    }
    if (reqCheckResult.rows[0].status !== "APPROVED") {
      return res.status(400).json({ error: `Cannot assign bed. Request status is: ${reqCheckResult.rows[0].status}` });
    }

    // Begin transaction
    await client.query("BEGIN");

    // 5. Update admission_requests status -> BED_ASSIGNED
    await client.query(
      "UPDATE admission_requests SET status = 'BED_ASSIGNED', updated_at = CURRENT_TIMESTAMP WHERE id = $1",
      [admissionRequestId]
    );

    // 6. Insert into admissions
    const insertAdmissionQuery = `
      INSERT INTO admissions (
        patient_id, ward_id, bed_id, attending_doctor_id,
        priority_id, expected_stay_duration, diagnosis, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'ACTIVE')
      RETURNING id, status, admission_date
    `;
    const admissionResult = await client.query(insertAdmissionQuery, [
      patientId, wardId, bedId, attendingDoctorId,
      priorityId, expectedStayDuration || null, diagnosis || null,
    ]);

    // 7. Update bed status -> OCCUPIED
    await client.query(
      "UPDATE beds SET status = 'OCCUPIED', updated_at = CURRENT_TIMESTAMP WHERE id = $1",
      [bedId]
    );

    const admissionId = admissionResult.rows[0].id;

    // 8. Log ADMITTED to admission_history
    await client.query(
      `INSERT INTO admission_history
        (admission_request_id, admission_id, patient_id, action, to_ward_id, to_bed_id, performed_by)
       VALUES ($1, $2, $3, 'ADMITTED', $4, $5, $6)`,
      [admissionRequestId, admissionId, patientId, wardId, bedId, userId]
    );

    // Commit
    await client.query("COMMIT");

    res.status(201).json({
      message: "Bed assigned and patient admitted successfully",
      admission: admissionResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
};

// Transfer Patient (Ward Manager action)
const transferPatient = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const userId = req.user.userId;
    const {
      admission_id,
      patient_id,
      from_ward_id,
      from_bed_id,
      to_ward_id,
      to_bed_id,
      transfer_reason,
    } = req.body;

    // 1. Validate required fields
    if (!admission_id || !patient_id || !from_ward_id || !from_bed_id || !to_ward_id || !to_bed_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 2. Check if logged-in user is a Ward Manager (role_id = 3)
    const userQuery = "SELECT role_id FROM users WHERE id = $1";
    const userResult = await client.query(userQuery, [userId]);

    if (userResult.rows.length === 0 || Number(userResult.rows[0].role_id) !== 3) {
      return res.status(403).json({ error: "Forbidden: Only Ward Managers can transfer patients" });
    }

    // 3. Check if the to_bed is AVAILABLE
    const bedQuery = "SELECT status FROM beds WHERE id = $1 AND is_active = TRUE";
    const bedResult = await client.query(bedQuery, [to_bed_id]);

    if (bedResult.rows.length === 0) {
      return res.status(404).json({ error: "Destination bed not found" });
    }
    if (bedResult.rows[0].status !== "AVAILABLE") {
      return res.status(400).json({ error: `Destination bed is not available. Current status: ${bedResult.rows[0].status}` });
    }

    // Begin transaction
    await client.query("BEGIN");

    // 4. Create record in admission_transfers
    const insertTransferQuery = `
      INSERT INTO admission_transfers (
        admission_id, from_ward_id, from_bed_id, to_ward_id, to_bed_id, reason, transferred_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, transferred_at
    `;
    const transferResult = await client.query(insertTransferQuery, [
      admission_id, from_ward_id, from_bed_id, to_ward_id, to_bed_id, transfer_reason || null, userId
    ]);

    // 5. Update admission record to point to new ward & bed
    await client.query(
      "UPDATE admissions SET ward_id = $1, bed_id = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3",
      [to_ward_id, to_bed_id, admission_id]
    );

    // 6. Set old bed status -> AVAILABLE
    await client.query(
      "UPDATE beds SET status = 'AVAILABLE', updated_at = CURRENT_TIMESTAMP WHERE id = $1",
      [from_bed_id]
    );

    // 7. Set new bed status -> OCCUPIED
    await client.query(
      "UPDATE beds SET status = 'OCCUPIED', updated_at = CURRENT_TIMESTAMP WHERE id = $1",
      [to_bed_id]
    );

    // 8. Log TRANSFERRED to admission_history
    await client.query(
      `INSERT INTO admission_history
        (admission_id, patient_id, action, from_ward_id, from_bed_id, to_ward_id, to_bed_id, performed_by, reason)
       VALUES ($1, $2, 'TRANSFERRED', $3, $4, $5, $6, $7, $8)`,
      [admission_id, patient_id, from_ward_id, from_bed_id, to_ward_id, to_bed_id, userId, transfer_reason || null]
    );

    // Commit
    await client.query("COMMIT");

    res.status(201).json({
      message: "Patient transferred successfully",
      transfer: transferResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
};

// Discharge Patient (Ward Manager action)
const dischargePatient = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const userId = req.user.userId;
    const { admission_id } = req.body;

    // 1. Validate required fields
    if (!admission_id) {
      return res.status(400).json({ error: "admission_id is required" });
    }

    // 2. Check if logged-in user is a Ward Manager (role_id = 3)
    const userQuery = "SELECT role_id FROM users WHERE id = $1";
    const userResult = await client.query(userQuery, [userId]);

    if (userResult.rows.length === 0 || Number(userResult.rows[0].role_id) !== 3) {
      return res.status(403).json({ error: "Forbidden: Only Ward Managers can discharge patients" });
    }

    // 3. Fetch the admission (must be ACTIVE)
    const admissionQuery = "SELECT id, bed_id, ward_id, patient_id, status FROM admissions WHERE id = $1";
    const admissionResult = await client.query(admissionQuery, [admission_id]);

    if (admissionResult.rows.length === 0) {
      return res.status(404).json({ error: "Admission not found" });
    }
    if (admissionResult.rows[0].status !== "ACTIVE") {
      return res.status(400).json({ error: `Cannot discharge. Admission status is: ${admissionResult.rows[0].status}` });
    }

    const bedId = admissionResult.rows[0].bed_id;

    // Begin transaction
    await client.query("BEGIN");

    // 4. Create discharge record
    const insertDischargeQuery = `
      INSERT INTO discharges (admission_id, discharged_by, discharge_date)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      RETURNING id, discharge_date
    `;
    const dischargeResult = await client.query(insertDischargeQuery, [admission_id, userId]);

    // 5. Update admissions: status -> DISCHARGED, set discharge_date
    await client.query(
      "UPDATE admissions SET status = 'DISCHARGED', discharge_date = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1",
      [admission_id]
    );

    // 6. Free up the bed: status -> AVAILABLE
    await client.query(
      "UPDATE beds SET status = 'AVAILABLE', updated_at = CURRENT_TIMESTAMP WHERE id = $1",
      [bedId]
    );

    // 7. Log DISCHARGED to admission_history
    // Fetch patient_id and ward_id from admission for history
    await client.query(
      `INSERT INTO admission_history
        (admission_id, patient_id, action, from_ward_id, from_bed_id, performed_by)
       VALUES ($1, $2, 'DISCHARGED', $3, $4, $5)`,
      [admission_id, admissionResult.rows[0].patient_id, admissionResult.rows[0].ward_id, bedId, userId]
    );

    // Commit
    await client.query("COMMIT");

    res.status(201).json({
      message: "Patient discharged successfully",
      discharge: dischargeResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
};

module.exports = {
  createAdmissionRequest,
  getDoctorAdmissionRequests,
  updateAdmissionRequestStatus,
  getApprovedAdmissionRequests,
  assignBed,
  transferPatient,
  dischargePatient,
};

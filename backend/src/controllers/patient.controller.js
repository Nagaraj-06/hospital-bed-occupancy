const { pool } = require("../config/db");

// Get All Patients with Approval and Bed details
const getAllPatients = async (req, res, next) => {
  try {
    const query = `
      SELECT 
        p.id, p.name, p.age, p.gender, p.patient_contact_no, p.emergency_contact_no,
        ar.status as request_status,
        d.id as doctor_id, u.name as doctor_name,
        ar.ward_id as requested_ward_id, rw.name as requested_ward_name,
        bt.name as bed_type_name, pt.name as priority_name,
        ar.expected_stay_duration, ar.diagnosis,
        a.id as admission_id, a.status as admission_status,
        w.id as ward_id, w.name as ward_name,
        b.id as bed_id, b.name as bed_name
      FROM patients p
      -- Join latest active request
      LEFT JOIN (
        SELECT DISTINCT ON (patient_id) *
        FROM admission_requests
        ORDER BY patient_id, requested_at DESC
      ) ar ON p.id = ar.patient_id
      LEFT JOIN doctors d ON ar.doctor_id = d.id
      LEFT JOIN users u ON d.user_id = u.id
      LEFT JOIN wards rw ON ar.ward_id = rw.id
      LEFT JOIN bed_types bt ON ar.bed_type_id = bt.id
      LEFT JOIN priority_types pt ON ar.priority_id = pt.id
      -- Join active admission
      LEFT JOIN (
        SELECT DISTINCT ON (patient_id) *
        FROM admissions
        WHERE status = 'ACTIVE'
        ORDER BY patient_id, admission_date DESC
      ) a ON p.id = a.patient_id
      LEFT JOIN wards w ON a.ward_id = w.id
      LEFT JOIN beds b ON a.bed_id = b.id
      WHERE 
        -- Filter out if the latest request is REJECTED
        (ar.status IS NULL OR ar.status != 'REJECTED')
        -- Filter out if the patient's latest admission has been discharged (exists in discharges table)
        AND p.id NOT IN (
          SELECT adm.patient_id 
          FROM admissions adm
          JOIN discharges d ON adm.id = d.admission_id
          WHERE adm.id = (
            SELECT id FROM admissions WHERE patient_id = adm.patient_id ORDER BY admission_date DESC LIMIT 1
          )
          -- But keep them if they made a NEW request after being discharged
          AND NOT EXISTS (
            SELECT 1 FROM admission_requests ar_new 
            WHERE ar_new.patient_id = adm.patient_id AND ar_new.requested_at > d.discharge_date
          )
        )
      ORDER BY p.id DESC
    `;

    const result = await pool.query(query);

    const patients = result.rows.map(row => {
      // Determine doctor approval status
      const isApproved = row.request_status === 'APPROVED' || row.request_status === 'BED_ASSIGNED';
      
      const doctor_approval_status = {
        approved: isApproved ? "Yes" : "No",
        ...(isApproved && row.doctor_id && {
          doctor_id: row.doctor_id,
          doctor_name: row.doctor_name,
        })
      };

      // Determine assigned ward & bed details
      const assigned_ward_bed = row.admission_id ? {
        admission_id: row.admission_id,
        admission_status: row.admission_status,
        ward_id: row.ward_id,
        ward_name: row.ward_name,
        bed_id: row.bed_id,
        bed_name: row.bed_name,
      } : null;

      return {
        id: row.id,
        name: row.name,
        age: row.age,
        gender: row.gender,
        patient_contact_no: row.patient_contact_no,
        emergency_contact_no: row.emergency_contact_no,
        request_status: row.request_status,
        requested_ward_id: row.requested_ward_id,
        requested_ward_name: row.requested_ward_name,
        bed_type_name: row.bed_type_name,
        priority_name: row.priority_name,
        expected_stay_duration: row.expected_stay_duration,
        diagnosis: row.diagnosis,
        doctor_name: row.doctor_name,
        doctor_approval_status,
        assigned_ward_bed
      };
    });

    res.status(200).json({
      count: patients.length,
      patients
    });
  } catch (error) {
    next(error);
  }
};

// Get Active Admissions (patients currently admitted with a bed)
const getActiveAdmissions = async (req, res, next) => {
  try {
    const query = `
      SELECT
        a.id AS admission_id,
        p.id AS patient_id,
        p.name AS patient_name,
        a.ward_id,
        w.name AS ward_name,
        a.bed_id,
        b.name AS bed_name,
        a.diagnosis,
        a.admission_date
      FROM admissions a
      JOIN patients p ON p.id = a.patient_id
      JOIN wards w ON w.id = a.ward_id
      JOIN beds b ON b.id = a.bed_id
      WHERE a.status = 'ACTIVE'
      ORDER BY a.admission_date DESC
    `;
    const result = await pool.query(query);
    res.status(200).json({ admissions: result.rows });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPatients,
  getActiveAdmissions,
};

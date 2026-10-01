const { pool } = require("../config/db");

// Shared base query for admission_history with joins
const historyBaseQuery = (whereClause = "") => `
  SELECT
    ah.id,
    ah.action,
    ah.reason,
    ah.created_at,

    -- Admission request & admission IDs
    ah.admission_request_id,
    ah.admission_id,

    -- Patient
    ah.patient_id,
    p.name         AS patient_name,
    p.age          AS patient_age,
    p.gender       AS patient_gender,

    -- Original admission request details
    ar.ward_id     AS requested_ward_id,
    rw.name        AS requested_ward_name,
    bt.name        AS requested_bed_type_name,
    du.name        AS requested_doctor_name,
    ar.expected_stay_duration,
    ar.diagnosis   AS request_diagnosis,

    -- From location
    fw.id          AS from_ward_id,
    fw.name        AS from_ward_name,
    fb.id          AS from_bed_id,
    fb.name        AS from_bed_name,

    -- To location
    tw.id          AS to_ward_id,
    tw.name        AS to_ward_name,
    tb.id          AS to_bed_id,
    tb.name        AS to_bed_name,

    -- Performed by
    ah.performed_by,
    u.name         AS performed_by_name,
    r.name         AS performed_by_role

  FROM admission_history ah
  JOIN patients  p  ON ah.patient_id    = p.id
  JOIN users     u  ON ah.performed_by  = u.id
  JOIN roles     r  ON u.role_id        = r.id
  LEFT JOIN wards fw ON ah.from_ward_id = fw.id
  LEFT JOIN beds  fb ON ah.from_bed_id  = fb.id
  LEFT JOIN wards tw ON ah.to_ward_id   = tw.id
  LEFT JOIN beds  tb ON ah.to_bed_id    = tb.id
  LEFT JOIN admission_requests ar ON ah.admission_request_id = ar.id
  LEFT JOIN wards rw ON ar.ward_id = rw.id
  LEFT JOIN bed_types bt ON ar.bed_type_id = bt.id
  LEFT JOIN doctors d ON ar.doctor_id = d.id
  LEFT JOIN users du ON d.user_id = du.id
  ${whereClause}
  ORDER BY ah.created_at DESC
`;

// GET all admission_history records
const getAllAdmissionHistory = async (req, res, next) => {
  try {
    const result = await pool.query(historyBaseQuery());
    res.status(200).json({
      count: result.rowCount,
      history: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

// GET Ward Logs: ADMITTED, TRANSFERRED, DISCHARGED only
const getWardLogs = async (req, res, next) => {
  try {
    const result = await pool.query(
      historyBaseQuery(`WHERE ah.action IN ('ADMITTED', 'TRANSFERRED', 'DISCHARGED')`)
    );
    res.status(200).json({
      count: result.rowCount,
      ward_logs: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAdmissionHistory,
  getWardLogs,
};

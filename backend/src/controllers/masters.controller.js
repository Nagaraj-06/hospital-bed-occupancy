const { pool } = require("../config/db");

// Get Priority Types
const getPriorityTypes = async (req, res, next) => {
  try {
    const query = "SELECT id, name FROM priority_types WHERE is_active = TRUE ORDER BY id ASC";
    const result = await pool.query(query);
    res.status(200).json({ priority_types: result.rows });
  } catch (error) {
    next(error);
  }
};

// Get Doctors
const getDoctors = async (req, res, next) => {
  try {
    const query = `
      SELECT d.id, u.name AS doctor_name, d.specialisation AS specialist
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE u.is_active = TRUE
      ORDER BY u.name ASC
    `;
    const result = await pool.query(query);
    res.status(200).json({ doctors: result.rows });
  } catch (error) {
    next(error);
  }
};

// Get Wards
const getWards = async (req, res, next) => {
  try {
    const query = `
      SELECT
        w.id,
        w.name,
        COUNT(b.id)::int AS total_beds,
        COUNT(b.id) FILTER (WHERE b.status = 'OCCUPIED')::int AS occupied_beds,
        COUNT(b.id) FILTER (WHERE b.status = 'AVAILABLE')::int AS available_beds
      FROM wards w
      LEFT JOIN beds b ON b.ward_id = w.id
      GROUP BY w.id, w.name
      ORDER BY w.name ASC
    `;
    const result = await pool.query(query);
    res.status(200).json({ wards: result.rows });
  } catch (error) {
    next(error);
  }
};

// Get Bed Types
const getBedTypes = async (req, res, next) => {
  try {
    const query = "SELECT id, name FROM bed_types WHERE is_active = TRUE ORDER BY name ASC";
    const result = await pool.query(query);
    res.status(200).json({ bed_types: result.rows });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPriorityTypes,
  getDoctors,
  getWards,
  getBedTypes,
};

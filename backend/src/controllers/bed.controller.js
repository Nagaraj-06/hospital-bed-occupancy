const { pool } = require("../config/db");

// Get Available Beds by Ward (Ward Manager action)
const getAvailableBedsByWard = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { wardId } = req.params;

    // 1. Check if logged-in user is a Ward Manager (role_id = 3)
    const userQuery = "SELECT role_id FROM users WHERE id = $1 AND is_active = TRUE";
    const userResult = await pool.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(403).json({ error: "User not found or inactive" });
    }
    if (Number(userResult.rows[0].role_id) !== 3) {
      return res.status(403).json({ error: "Forbidden: Only Ward Managers can fetch available beds this way" });
    }

    // 2. Fetch available beds for the specified ward
    const bedsQuery = `
      SELECT b.id, b.name, b.bed_type_id, bt.name as bed_type_name
      FROM beds b
      JOIN bed_types bt ON b.bed_type_id = bt.id
      WHERE b.ward_id = $1 
        AND b.status = 'AVAILABLE' 
        AND b.is_active = TRUE
      ORDER BY b.name ASC
    `;
    const bedsResult = await pool.query(bedsQuery, [wardId]);

    const availableBeds = bedsResult.rows.map(row => ({
      id: row.id,
      name: row.name,
      bed_type: {
        id: row.bed_type_id,
        name: row.bed_type_name
      }
    }));

    res.status(200).json({
      count: availableBeds.length,
      available_beds: availableBeds,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Beds by Ward (with patient info for display)
const getAllBedsByWard = async (req, res, next) => {
  try {
    const { wardId } = req.params;

    const bedsQuery = `
      SELECT
        b.id,
        b.name,
        b.status,
        bt.name AS bed_type_name,
        p.id AS patient_id,
        p.name AS patient_name
      FROM beds b
      JOIN bed_types bt ON b.bed_type_id = bt.id
      LEFT JOIN admissions a ON a.bed_id = b.id AND a.status = 'ACTIVE'
      LEFT JOIN patients p ON p.id = a.patient_id
      WHERE b.ward_id = $1 AND b.is_active = TRUE
      ORDER BY bt.name ASC, b.name ASC
    `;
    const result = await pool.query(bedsQuery, [wardId]);

    res.status(200).json({ beds: result.rows });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAvailableBedsByWard,
  getAllBedsByWard,
};

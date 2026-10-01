const bcrypt = require("bcrypt");
const { pool } = require("../config/db");
const { generateToken } = require("../utils/jwt");

// Create User API
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role_id } = req.body;

    if (!name || !email || !password || !role_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user already exists
    const checkUserQuery = "SELECT * FROM users WHERE email = $1";
    const checkUserResult = await pool.query(checkUserQuery, [email]);
    
    if (checkUserResult.rows.length > 0) {
      return res.status(409).json({ error: "User with this email already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert into database
    const insertQuery = `
      INSERT INTO users (name, email, password, role_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role_id, is_active, created_at
    `;
    const values = [name, email, hashedPassword, role_id];
    
    const result = await pool.query(insertQuery, values);
    const newUser = result.rows[0];

    // Generate JWT token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      roleId: newUser.role_id,
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 4 * 24 * 60 * 60 * 1000, // 4 days
      sameSite: "strict"
    });

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Users API
const getAllUsers = async (req, res, next) => {
  try {
    // Exclude password from the results
    const query = `
      SELECT id, name, email, role_id, is_active, created_at, updated_at
      FROM users
      ORDER BY id ASC
    `;
    const result = await pool.query(query);
    
    res.status(200).json({
      users: result.rows,
      count: result.rowCount
    });
  } catch (error) {
    next(error);
  }
};

// Login User API
const loginUser = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: "Email, password, and role are required" });
    }

    const roleIds = { staff: 1, doctor: 2, "ward manager": 3 };
    const selectedRole = String(role).trim().toLowerCase();
    if (!roleIds[selectedRole]) {
      return res.status(400).json({ error: "Please select a valid role" });
    }

    // Find the user
    const query = "SELECT id, name, email, password, role_id, is_active FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({ error: "Account is deactivated" });
    }

    if (Number(user.role_id) !== roleIds[selectedRole]) {
      return res.status(403).json({
        error: `This account is not registered as ${role}. Choose the role assigned to your account.`,
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      roleId: user.role_id,
    });

    // Remove password from response
    delete user.password;

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 4 * 24 * 60 * 60 * 1000, // 4 days
      sameSite: "strict"
    });

    res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  loginUser,
};

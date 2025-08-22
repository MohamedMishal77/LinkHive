// routes/authRoutes.js
import express from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/auth.js";
import pool from "../db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        code: "MISSING_CREDENTIALS",
        message: "Email and password are required",
      });
    }

    // 2️⃣ Check if user exists
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({
        status: "error",
        code: "USER_NOT_FOUND",
        message: "Invalid email or password",
      });
    }

    // 3️⃣ Compare password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({
        status: "error",
        code: "INVALID_PASSWORD",
        message: "Invalid email or password",
      });
    }

    // 4️⃣ Generate JWT token
    const token = generateToken(user.id);

    // 5️⃣ Send token + user info (omit password)
    return res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username, // ✅ fixed
        email: user.email,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      status: "error",
      code: "SERVER_ERROR",
      message: "An unexpected error occurred during login",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

export default router;

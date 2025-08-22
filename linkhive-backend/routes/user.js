// routes/userRoutes.js
import express from "express";
import pool from "../db.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Get logged-in user profile
 */
router.get("/user", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const { rows } = await pool.query(
      "SELECT id, username, email FROM users WHERE id = $1",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        code: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: rows[0],
    });
  } catch (error) {
    console.error("💥 Error fetching user:", error);

    res.status(500).json({
      success: false,
      code: "SERVER_ERROR",
      message: "An unexpected error occurred while fetching user",
      // Only include technical details in dev mode
      ...(process.env.NODE_ENV === "development" && { details: error.message }),
    });
  }
});

export default router;

// routes/customization.js
import express from "express";
import pool from "../db.js";
import { authenticateToken } from "../utils/auth.js";

const router = express.Router();

router.post("/save", authenticateToken, async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    // Make sure username is unique (except for the current user)
    const exists = await pool.query(
      "SELECT id FROM users WHERE username = $1 AND id != $2",
      [username, req.user.userId]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Save customization (only username now)
    const updated = await pool.query(
      "UPDATE users SET username = $1 WHERE id = $2 RETURNING id, username",
      [username, req.user.userId]
    );

    res.json({
      message: "Preferences saved successfully",
      user: updated.rows[0],
    });
  } catch (err) {
    console.error("Error saving customization:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

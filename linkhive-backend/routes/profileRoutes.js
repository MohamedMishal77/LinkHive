// routes/profileRoutes.js
import express from "express";
import pool from "../db.js";

const router = express.Router();

// Public profile route
router.get("/public/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const result = await pool.query(
      `SELECT username, display_name, tagline, background, typography
       FROM users
       WHERE username = $1`,
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    // Parse background and typography if stored as JSON strings
    const background =
      typeof user.background === "string"
        ? JSON.parse(user.background)
        : user.background || {};

    const typography =
      typeof user.typography === "string"
        ? JSON.parse(user.typography)
        : user.typography || {};

    // Fetch user's links
    const linksResult = await pool.query(
      `SELECT site_name AS siteName, site_username AS siteUsername, profile_url AS profileUrl
       FROM links
       WHERE user_id = (SELECT id FROM users WHERE username = $1)`,
      [username]
    );

    res.json({
      username: user.username, // actual login username (URL reference)
      displayName: user.display_name || user.username, // preferred display name
      tagline: user.tagline,
      background,
      typography,
      links: linksResult.rows || [],
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

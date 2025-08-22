import express from "express";
import pool from "../db.js"; // PostgreSQL connection
import { verifyToken } from "../middleware/authMiddleware.js"; // Auth middleware

const router = express.Router();

/**
 * Save customization (POST)
 */
router.post("/", verifyToken, async (req, res) => {
  console.log("=== Customization API HIT ===");
  console.log("Request body:", req.body);

  try {
    const { displayName, tagline, background, typography, links } = req.body;
    const userId = req.user.userId; // from JWT token

    // Ensure background & typography are objects (not strings)
    const bgData =
      background && typeof background === "string"
        ? JSON.parse(background)
        : background || {};
    const typoData =
      typography && typeof typography === "string"
        ? JSON.parse(typography)
        : typography || {};

    // Save customization fields to users table
    await pool.query(
      `UPDATE users
       SET display_name = $1,
           tagline = $2,
           background = $3,
           typography = $4
       WHERE id = $5`,
      [displayName || "", tagline || "", bgData, typoData, userId]
    );

    // Save links (overwrite old ones)
    if (Array.isArray(links)) {
      await pool.query("DELETE FROM links WHERE user_id = $1", [userId]);
      for (let link of links) {
        await pool.query(
          "INSERT INTO links (user_id, site_name, site_username, profile_url) VALUES ($1, $2, $3, $4)",
          [
            userId,
            link.siteName || "",
            link.siteUsername || "",
            link.profileUrl || "",
          ]
        );
      }
    }

    // Retrieve username for redirect
    const userResult = await pool.query(
      "SELECT username FROM users WHERE id = $1",
      [userId]
    );
    const registeredUsername = userResult.rows[0].username;

    res.status(200).json({
      success: true,
      message: "Customization saved successfully",
      username: registeredUsername,
    });
  } catch (error) {
    console.error("💥 Error saving customization:", error);
    res.status(500).json({
      success: false,
      error: "Server error while saving customization",
      details: error.message,
    });
  }
});

/**
 * Fetch customization (GET)
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get customization fields from users table
    const userResult = await pool.query(
      `SELECT display_name, tagline, background, typography
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0];

    // ✅ No JSON.parse needed (Postgres JSONB returns objects directly)
    const background = user.background || {};
    const typography = user.typography || {};

    // Get links from links table
    const linksResult = await pool.query(
      "SELECT site_name, site_username, profile_url FROM links WHERE user_id = $1",
      [userId]
    );

    const links = linksResult.rows.map((row) => ({
      siteName: row.site_name,
      siteUsername: row.site_username,
      profileUrl: row.profile_url,
    }));

    // Send response
    res.json({
      displayName: user.display_name || "",
      tagline: user.tagline || "",
      background,
      typography,
      links,
    });
  } catch (error) {
    console.error("💥 Error fetching customization:", error);
    res.status(500).json({
      success: false,
      error: "Server error while fetching customization",
      details: error.message,
    });
  }
});

export default router;

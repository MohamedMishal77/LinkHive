import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import pool from "./db.js";
import customizationRoutes from "./routes/customizationRoutes.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import dotenv from "dotenv";
import profileRoutes from "./routes/profileRoutes.js";

dotenv.config();
const app = express();

// ========================
// Middleware
// ========================

// ✅ Explicitly allow both localhost and deployed frontend
const allowedOrigins = [
  "http://localhost:5173",
  "https://linkhive-frontend.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (e.g., mobile apps, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// ========================
// Test DB Connection
// ========================
try {
  await pool.connect();
  console.log("✅ Connected to PostgreSQL");
} catch (err) {
  console.error("❌ DB Connection Error:", err.message);
  process.exit(1);
}

// Make pool available to routes
app.locals.pool = pool;

// ========================
// Routes
// ========================
app.use("/api", profileRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api/customization", customizationRoutes);

// ========================
// Registration endpoint
// ========================
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
      [username, email, hashedPassword]
    );

    res.status(201).json({ success: true, userId: result.rows[0].id });
  } catch (err) {
    console.error("❌ Registration Error:", err.message);
    if (err.code === "23505") {
      return res
        .status(409)
        .json({ success: false, message: "Username or email already exists" });
    }
    res
      .status(500)
      .json({ success: false, message: "Server error during registration" });
  }
});

// ========================
// Global Error Handler
// ========================
app.use((err, req, res, next) => {
  console.error("🔥 Unhandled Error:", err.stack);
  res
    .status(500)
    .json({ success: false, message: "Internal server error" });
});

// ========================
// Start Server
// ========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;

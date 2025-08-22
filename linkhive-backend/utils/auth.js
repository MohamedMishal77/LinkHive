// utils/auth.js (ESM version)
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret"; // fallback for local dev
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

// Generate JWT token
export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Authenticate JWT token middleware
export function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);

    return res.status(403).json({
      message: error.name === "TokenExpiredError"
        ? "Token expired, please log in again"
        : "Invalid token",
    });
  }
}

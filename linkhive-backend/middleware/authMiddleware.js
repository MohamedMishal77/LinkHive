// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

/**
 * Middleware to verify JWT token from Authorization header
 */
export function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({
        error: "AUTH_NO_TOKEN",
        message: "No token provided. Authorization denied.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "AUTH_TOKEN_EXPIRED",
        message: "Token has expired. Please log in again.",
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({
        error: "AUTH_INVALID_TOKEN",
        message: "Invalid token. Access denied.",
      });
    }

    // Generic error fallback
    return res.status(500).json({
      error: "AUTH_UNKNOWN_ERROR",
      message: "An unexpected error occurred during authentication.",
    });
  }
}

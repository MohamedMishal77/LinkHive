import pkg from "pg";
import dotenv from "dotenv";

dotenv.config(); // ✅ loads .env locally

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required for Supabase + Render
  },
});

pool.connect()
  .then(() => console.log("✅ Connected to database"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

export default pool;

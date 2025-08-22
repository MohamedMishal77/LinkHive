import pkg from "pg";
import dotenv from "dotenv";


const isProd = process.env.NODE_ENV === "production";

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: isProd ? { rejectUnauthorized: false } : false,
      }
    : {
        user: process.env.DB_USER || "postgres",
        host: process.env.DB_HOST || "localhost",
        database: process.env.DB_NAME || "LinkHive",
        password: process.env.DB_PASSWORD || "",
        port: Number(process.env.DB_PORT || 5432),
      }
);

export default pool;


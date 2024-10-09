import { createPool } from "mysql2/promise";

// export const pool = createPool({
//   host: process.env.DB_HOST || '107.22.252.129',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || 'utec',
//   database: process.env.DB_DATABASE || 'scooter_management',
//   port: process.env.DB_PORT || 8006
// });

export const pool = createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "scooter_management",
  port: 3308,
});

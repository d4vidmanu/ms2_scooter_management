import { createPool } from "mysql2/promise";

export const pool = createPool({
  host: process.env.DB_HOST || '34.195.53.21',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'utec',
  database: process.env.DB_DATABASE || 'scooter_management',
  port: process.env.DB_PORT || 3308
});

// export const pool = createPool({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASSWORD || "",
//   database: process.env.DB_DATABASE || "scooter_management",
//   port: 3308,
// });

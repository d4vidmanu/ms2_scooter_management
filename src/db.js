import { createPool } from "mysql2/promise";

export const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    port: 3306,
    database: "scooter_management"  // Cambia al nombre correcto de tu base de datos
})

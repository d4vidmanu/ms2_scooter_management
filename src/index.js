import express from "express";
import cors from "cors";
import scooterRoutes from "./routes/scooters.routes.js";
import rideRoutes from "./routes/rides.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

// Configuración de Swagger
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Scooter Rental API",
            version: "1.0.0",
            description: "API para la gestión de scooters y rides",
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ["./src/routes/*.js"], // Ruta a los archivos donde definimos las rutas
};

const specs = swaggerJsdoc(options);

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
    })
);

app.use(express.json());

// Ruta de la documentación Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Rutas de scooters y rides
app.use(scooterRoutes);
app.use(rideRoutes);

app.listen(3000, () => {
    console.log("Server running on port 3000");
    console.log("Swagger UI disponible en http://localhost:3000/api-docs");
});

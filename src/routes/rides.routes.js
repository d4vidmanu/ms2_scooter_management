import { Router } from "express";
import {
  getRides,
  getRideById,
  createRide,
  updateRide,
  deleteRide,
} from "../controllers/rides.controller.js";

const router = Router();

// Obtener todos los rides
router.get("/rides", getRides);

// Obtener un ride por ID
router.get("/rides/:id", getRideById);

// Crear un nuevo ride
router.post("/rides", createRide);

// Actualizar un ride por ID
router.put("/rides/:id", updateRide);

// Eliminar un ride por ID
router.delete("/rides/:id", deleteRide);

export default router;

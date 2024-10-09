import { Router } from "express";
import {
  getRides,
  getRideById,
  createRide,
  updateRide,
  deleteRide,
  createBasicRide,
  updateRideEnd,
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

// Crear un ride solo con scooter_id y user_id
router.post("/rides/create", createBasicRide);

// Actualizar el ride con end_time y end_location
router.put("/rides/:id/end", updateRideEnd);

export default router;

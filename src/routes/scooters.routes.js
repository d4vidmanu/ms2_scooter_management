import { Router } from "express";
import {
  getScooters,
  createScooter,
  updateScooter,
  deleteScooter,
  getScooterById,
  getAvailableScooters,
} from "../controllers/scooters.controller.js";
const router = Router();

router.get("/scooters", getScooters);
router.get("/avaliblescooters", getAvailableScooters);
router.get("/scooters/:id", getScooterById);
router.post("/scooters", createScooter);
router.put("/scooters/:id", updateScooter);
router.delete("/scooters/:id", deleteScooter);
export default router;

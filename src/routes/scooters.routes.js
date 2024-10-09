import { Router } from "express";
import {
  getScooters,
  createScooter,
  updateScooter,
  deleteScooter,
  getScooterById,
} from "../controllers/scooters.controller.js";
const router = Router();

router.get("/scooters", getScooters);
router.get("/scooters/:id", getScooterById);
router.post("/scooters", createScooter);
router.put("/scooters/:id", updateScooter);
router.delete("/scooters/:id", deleteScooter);
export default router;

import { Router } from "express";
import { getScooters, createScooter, updateScooter, deleteScooter} from '../controllers/scooters.controller.js';
const router = Router();

router.get('/scooters', getScooters)

router.post('/scooters', createScooter)

router.put('/scooters', updateScooter)

router.delete('/scooters', deleteScooter)

export default router;
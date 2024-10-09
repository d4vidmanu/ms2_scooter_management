import { Router } from "express";
import { getScooters, createScooter, updateScooter, deleteScooter, getScooterById} from '../controllers/scooters.controller.js';
const router = Router();

router.get('/scooters', getScooters)

router.post('/scooters', createScooter)

router.patch('/scooters/:scooter_id', updateScooter);

router.delete('/scooters/:scooter_id', deleteScooter); 

router.get('/scooters/:scooter_id', getScooterById);

export default router;
import { Router } from "express";
import { getScooters, createScooter, updateScooter, deleteScooter} from '../controllers/scooters.controller.js';
const router = Router();

router.get('/scooters', getScooters)

router.post('/scooters', createScooter)

router.put('/scooters/:scooter_id', updateScooter);

router.delete('/scooters/:scooter_id', deleteScooter); 

export default router;
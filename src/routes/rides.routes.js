import { Router } from "express";
import { getRide, createRide, updateRide, deleteRide} from '../controllers/rides.controller.js';

const router = Router();

router.get('/rides', getRide)

router.post('/rides', createRide)

router.put('/rides', updateRide)

router.delete('/rides', deleteRide)

export default router;
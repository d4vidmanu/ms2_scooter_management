import { Router } from "express";
import { getRide, createRide, updateRide, deleteRide} from '../controllers/rides.controller.js';

const router = Router();

router.get('/rides', getRide)

router.post('/rides', createRide)

router.patch('/rides/:ride_id', updateRide)

router.delete('/rides/:ride_id', deleteRide)

export default router;
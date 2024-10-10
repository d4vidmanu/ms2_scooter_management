import { Router } from "express";
import {
  getScooters,
  createScooter,
  updateScooter,
  deleteScooter,
  getScooterById,
} from "../controllers/scooters.controller.js";
const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Scooter:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         model:
 *           type: string
 *         status:
 *           type: string
 *           enum: [available, in_use, in_maintenance]
 *         battery_level:
 *           type: integer
 *           description: El nivel de batería del scooter en porcentaje
 *       required:
 *         - model
 *         - status
 */

/**
 * @swagger
 * /scooters:
 *   get:
 *     summary: Obtener todos los scooters
 *     responses:
 *       200:
 *         description: Lista de scooters
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Scooter'
 */
router.get("/scooters", getScooters);

/**
 * @swagger
 * /scooters/{id}:
 *   get:
 *     summary: Obtener un scooter por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Un scooter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Scooter'
 */
router.get("/scooters/:id", getScooterById);

/**
 * @swagger
 * /scooters:
 *   post:
 *     summary: Crear un nuevo scooter
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Scooter'
 *     responses:
 *       201:
 *         description: Scooter creado
 */
router.post("/scooters", createScooter);

/**
 * @swagger
 * /scooters/{id}:
 *   put:
 *     summary: Actualizar un scooter por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Scooter'
 *     responses:
 *       200:
 *         description: Scooter actualizado
 */
router.put("/scooters/:id", updateScooter);

/**
 * @swagger
 * /scooters/{id}:
 *   delete:
 *     summary: Eliminar un scooter por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       204:
 *         description: Scooter eliminado
 */
router.delete("/scooters/:id", deleteScooter);

export default router;

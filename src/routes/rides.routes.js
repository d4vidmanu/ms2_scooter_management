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

/**
 * @swagger
 * components:
 *   schemas:
 *     Ride:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         scooter_id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         start_time:
 *           type: string
 *           format: date-time
 *         end_time:
 *           type: string
 *           format: date-time
 *         start_location:
 *           type: string
 *         end_location:
 *           type: string
 *       required:
 *         - scooter_id
 *         - user_id
 */

/**
 * @swagger
 * /rides:
 *   get:
 *     summary: Obtener todos los rides
 *     responses:
 *       200:
 *         description: Lista de rides
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ride'
 */
router.get("/rides", getRides);

/**
 * @swagger
 * /rides/{id}:
 *   get:
 *     summary: Obtener un ride por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Un ride
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ride'
 */
router.get("/rides/:id", getRideById);

/**
 * @swagger
 * /rides:
 *   post:
 *     summary: Crear un nuevo ride
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ride'
 *     responses:
 *       201:
 *         description: Ride creado
 */
router.post("/rides", createRide);

/**
 * @swagger
 * /rides/{id}:
 *   put:
 *     summary: Actualizar un ride por ID
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
 *             $ref: '#/components/schemas/Ride'
 *     responses:
 *       200:
 *         description: Ride actualizado
 */
router.put("/rides/:id", updateRide);

/**
 * @swagger
 * /rides/{id}:
 *   delete:
 *     summary: Eliminar un ride por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       204:
 *         description: Ride eliminado
 */
router.delete("/rides/:id", deleteRide);

/**
 * @swagger
 * /rides/create:
 *   post:
 *     summary: Crear un ride básico con scooter_id y user_id
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scooter_id:
 *                 type: integer
 *               user_id:
 *                 type: integer
 *             required:
 *               - scooter_id
 *               - user_id
 *     responses:
 *       201:
 *         description: Ride básico creado
 */
router.post("/rides/create", createBasicRide);

/**
 * @swagger
 * /rides/{id}/end:
 *   put:
 *     summary: Actualizar el ride con end_time y end_location
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
 *             type: object
 *             properties:
 *               end_time:
 *                 type: string
 *                 format: date-time
 *               end_location:
 *                 type: string
 *             required:
 *               - end_time
 *               - end_location
 *     responses:
 *       200:
 *         description: Ride actualizado
 */
router.put("/rides/:id/end", updateRideEnd);

export default router;
//-
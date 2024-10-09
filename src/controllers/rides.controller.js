import { pool } from "../db.js";

export const createRide = async (req, res) => {
  const { scooter_id, user_id, start_time, start_location } = req.body;

  const [lat, lng] = start_location
    .split(",")
    .map((coord) => parseFloat(coord.trim()));
  const point = `POINT(${lat} ${lng})`;

  try {
    const [result] = await pool.query(
      "INSERT INTO rides (scooter_id, user_id, start_time, start_location) VALUES (?, ?, ?, ST_GeomFromText(?, 4326))",
      [scooter_id, user_id, start_time, point]
    );

    const [newRide] = await pool.query(
      "SELECT ride_id, scooter_id, user_id, start_time, end_time, ST_AsText(start_location) AS start_location, ST_AsText(end_location) AS end_location, cost FROM rides WHERE ride_id = ?",
      [result.insertId]
    );

    // Devolver el objeto del ride recién creado
    res.status(201).json({
      ride: newRide[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear el ride" });
  }
};

export const getRides = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT ride_id, scooter_id, user_id, start_time, end_time, ST_AsText(start_location) AS start_location, ST_AsText(end_location) AS end_location, cost FROM rides"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los rides" });
  }
};

export const getRideById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT ride_id, scooter_id, user_id, start_time, end_time, ST_AsText(start_location) AS start_location, ST_AsText(end_location) AS end_location, cost FROM rides WHERE ride_id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Ride no encontrado" });
    }

    // Devolver el objeto del ride
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el ride" });
  }
};

export const updateRide = async (req, res) => {
  const { id } = req.params;
  const { end_time, end_location } = req.body;

  const [lat, lng] = end_location
    .split(",")
    .map((coord) => parseFloat(coord.trim()));
  const point = `POINT(${lat} ${lng})`;

  try {
    const [result] = await pool.query(
      "UPDATE rides SET end_time = ?, end_location = ST_GeomFromText(?, 4326) WHERE ride_id = ?",
      [end_time, point, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Ride no encontrado" });
    }

    const [updatedRide] = await pool.query(
      "SELECT ride_id, scooter_id, user_id, start_time, end_time, ST_AsText(start_location) AS start_location, ST_AsText(end_location) AS end_location, cost FROM rides WHERE ride_id = ?",
      [id]
    );

    // Devolver el objeto del ride actualizado
    res.json(updatedRide[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el ride" });
  }
};

export const deleteRide = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM rides WHERE ride_id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Ride no encontrado" });
    }

    // Devolver mensaje de éxito
    res.status(200).json({ message: "Ride eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el ride" });
  }
};

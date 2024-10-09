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

export const createBasicRide = async (req, res) => {
  const { scooter_id, user_id } = req.body;

  try {
    // Verificar si el scooter está "available"
    const [scooter] = await pool.query(
      "SELECT scooter_status, ST_AsText(location) AS location FROM scooters WHERE scooter_id = ?",
      [scooter_id]
    );

    if (scooter.length === 0) {
      return res.status(404).json({ message: "Scooter no encontrado" });
    }

    if (scooter[0].scooter_status !== "available") {
      return res.status(400).json({ message: "El scooter no está disponible" });
    }

    const start_location = scooter[0].location;

    // Cambiar el estado del scooter a "in use"
    await pool.query(
      "UPDATE scooters SET scooter_status = ? WHERE scooter_id = ?",
      ["in use", scooter_id]
    );

    // Insertar el ride con start_location
    const [result] = await pool.query(
      "INSERT INTO rides (scooter_id, user_id, start_location) VALUES (?, ?, ST_GeomFromText(?, 4326))",
      [scooter_id, user_id, start_location]
    );

    const [newRide] = await pool.query(
      "SELECT ride_id, scooter_id, user_id, start_time, ST_AsText(start_location) AS start_location FROM rides WHERE ride_id = ?",
      [result.insertId]
    );

    // Devolver el ride recién creado
    res.status(201).json({
      ride: newRide[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear el ride" });
  }
};

export const updateRideEnd = async (req, res) => {
  const { id } = req.params;

  try {
    // Obtener la ubicación actual del scooter
    const [scooter] = await pool.query(
      "SELECT scooter_id, ST_AsText(location) AS location FROM scooters WHERE scooter_id = (SELECT scooter_id FROM rides WHERE ride_id = ?)",
      [id]
    );

    if (scooter.length === 0) {
      return res.status(404).json({ message: "Scooter no encontrado" });
    }

    const end_location = scooter[0].location;

    // Actualizar el ride con end_time y end_location
    const [result] = await pool.query(
      "UPDATE rides SET end_time = NOW(), end_location = ST_GeomFromText(?, 4326) WHERE ride_id = ?",
      [end_location, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Ride no encontrado" });
    }

    // Cambiar el estado del scooter a "available"
    await pool.query(
      "UPDATE scooters SET scooter_status = ? WHERE scooter_id = ?",
      ["available", scooter[0].scooter_id]
    );

    // Obtener el ride actualizado, incluyendo el costo
    const [updatedRide] = await pool.query(
      "SELECT ride_id, scooter_id, user_id, start_time, end_time, ST_AsText(start_location) AS start_location, ST_AsText(end_location) AS end_location, cost FROM rides WHERE ride_id = ?",
      [id]
    );

    // Devolver el ride actualizado con el costo
    res.json(updatedRide[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el ride" });
  }
};

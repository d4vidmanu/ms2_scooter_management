import { pool } from "../db.js";

export const createScooter = async (req, res) => {
  const { scooter_status, battery_level, location } = req.body;

  const [lat, lng] = location
    .split(",")
    .map((coord) => parseFloat(coord.trim()));
  const point = `POINT(${lat} ${lng})`;

  try {
    const [result] = await pool.query(
      "INSERT INTO scooters (scooter_status, battery_level, location) VALUES (?, ?, ST_GeomFromText(?, 4326))",
      [scooter_status, battery_level, point]
    );

    const [newScooter] = await pool.query(
      "SELECT scooter_id, scooter_status, battery_level, ST_AsText(location) AS location FROM scooters WHERE scooter_id = ?",
      [result.insertId]
    );

    // Devolver solo el objeto del scooter creado
    res.status(201).json({
      scooter: newScooter[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear el scooter" });
  }
};

export const getScooterById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT scooter_id, scooter_status, battery_level, ST_AsText(location) AS location FROM scooters WHERE scooter_id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Scooter no encontrado" });
    }

    // Devolver solo el objeto del scooter
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el scooter" });
  }
};

export const updateScooter = async (req, res) => {
  const { id } = req.params;
  const { scooter_status, battery_level, location } = req.body;

  const [lat, lng] = location
    .split(",")
    .map((coord) => parseFloat(coord.trim()));
  const point = `POINT(${lat} ${lng})`;

  try {
    const [result] = await pool.query(
      "UPDATE scooters SET scooter_status = ?, battery_level = ?, location = ST_GeomFromText(?, 4326) WHERE scooter_id = ?",
      [scooter_status, battery_level, point, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Scooter no encontrado" });
    }

    const [updatedScooter] = await pool.query(
      "SELECT scooter_id, scooter_status, battery_level, ST_AsText(location) AS location FROM scooters WHERE scooter_id = ?",
      [id]
    );

    // Devolver solo el objeto del scooter actualizado
    res.json(updatedScooter[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el scooter" });
  }
};

export const deleteScooter = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "DELETE FROM scooters WHERE scooter_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Scooter no encontrado" });
    }

    // Devolver mensaje de éxito y código de estado 200
    res.status(200).json({ message: "Scooter eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el scooter" });
  }
};

export const getScooters = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT scooter_id, scooter_status, battery_level, ST_AsText(location) AS location FROM scooters"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los scooters" });
  }
};

export const getAvailableScooters = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT scooter_id, scooter_status, battery_level, ST_AsText(location) AS location FROM scooters WHERE scooter_status = 'available'"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los scooters disponibles" });
  }
};

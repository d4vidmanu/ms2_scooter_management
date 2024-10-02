import { pool } from "../db.js"

export const getRide = async (req, res) => {
    const result = await pool.query('SELECT * FROM rides')
    res.json(result[0])}

export const createRide = async (req, res) => {
    const { scooter_id, user_id, start_location } = req.body;

    // Separar latitud y longitud a partir de la cadena de start_location
    const [lat, lng] = start_location.split(",").map(coord => parseFloat(coord.trim()));

    // Crear el valor de POINT para MySQL con el SRID 4326
    const point = `ST_GeomFromText('POINT(${lat} ${lng})', 4326)`;

    // Ejecutar la consulta SQL para crear el ride
    const [result] = await pool.query(
        `INSERT INTO rides (scooter_id, user_id, start_location) 
        VALUES (?, ?, ${point})`,
        [scooter_id, user_id]
    );

    // Responder con el ID del ride creado
    res.status(201).json({
        message: 'Ride creado exitosamente',
        ride_id: result.insertId,
    });
};

export const updateRide = async (req, res) => {
    const { end_location } = req.body;
    const { ride_id } = req.params;

    // Obtener la fecha y hora actual para end_time
    const end_time = new Date();

    // Separar latitud y longitud a partir de la cadena de end_location
    const [lat, lng] = end_location.split(",").map(coord => parseFloat(coord.trim()));

    // Crear el valor de POINT para MySQL con el SRID 4326
    const point = `ST_GeomFromText('POINT(${lat} ${lng})', 4326)`;

    // Ejecutar la consulta SQL para actualizar end_time y end_location
    const [result] = await pool.query(
        `UPDATE rides 
        SET end_time = ?, end_location = ${point}
        WHERE ride_id = ?`,
        [end_time, ride_id]
    );

    // Verificar si se actualizó algún registro
    if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Ride no encontrado' });
    }

    res.json({ message: 'Ride actualizado exitosamente' });
};

export const deleteRide = async (req, res) => {
    const { ride_id } = req.params;

    // Ejecutar la consulta SQL para eliminar el ride
    const [result] = await pool.query('DELETE FROM rides WHERE ride_id = ?', [ride_id]);

    // Verificar si se eliminó algún registro
    if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Ride no encontrado' });
    }

    res.json({ message: 'Ride eliminado exitosamente' });
};
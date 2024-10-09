import { pool } from "../db.js"

export const getRide = async (req, res) => {
    const result = await pool.query('SELECT * FROM rides')
    res.json(result[0])}

export const createRide = async (req, res) => {
    const { scooter_id, user_id } = req.body;

    try {
        // 1. Obtener la ubicación del scooter desde la tabla scooters
        const [scooter] = await pool.query(
            `SELECT ST_AsText(location) AS location FROM scooters WHERE scooter_id = ?`,
            [scooter_id]
        );

        // Verificar si el scooter existe
        if (scooter.length === 0) {
            return res.status(404).json({ message: 'Scooter no encontrado' });
        }

        const scooterLocation = scooter[0].location; // El valor viene como un texto 'POINT(lng lat)'

        // 2. Insertar el viaje usando la ubicación del scooter como start_location con SRID 4326
        const [result] = await pool.query(
            `INSERT INTO rides (scooter_id, user_id, start_location) 
            VALUES (?, ?, ST_SRID(ST_GeomFromText(?), 4326))`,
            [scooter_id, user_id, scooterLocation]
        );

        // Responder con el ID del ride creado
        res.status(201).json({
            message: 'Ride creado exitosamente',
            ride_id: result.insertId,
        });

    } catch (error) {
        // Manejo de errores
        console.error(error);
        res.status(500).json({ message: 'Error al crear el ride' });
    }
};
    
    

export const updateRide = async (req, res) => {
const { ride_id } = req.params;

// Obtener la fecha y hora actual para end_time
const end_time = new Date();

try {
    // 1. Obtener el scooter_id relacionado con el ride
    const [ride] = await pool.query(
        `SELECT scooter_id FROM rides WHERE ride_id = ?`,
        [ride_id]
    );

    // Verificar si el ride existe
    if (ride.length === 0) {
        return res.status(404).json({ message: 'Ride no encontrado' });
    }

    const scooter_id = ride[0].scooter_id;

    // 2. Obtener la ubicación del scooter desde la tabla scooters
    const [scooter] = await pool.query(
        `SELECT ST_AsText(location) AS location FROM scooters WHERE scooter_id = ?`,
        [scooter_id]
    );

    // Verificar si el scooter existe
    if (scooter.length === 0) {
        return res.status(404).json({ message: 'Scooter no encontrado' });
    }

    const end_location = scooter[0].location; // El valor viene como un texto 'POINT(lng lat)'

    // 3. Actualizar el ride con end_time y la ubicación del scooter como end_location con SRID 4326
    const [result] = await pool.query(
        `UPDATE rides 
        SET end_time = ?, end_location = ST_SRID(ST_GeomFromText(?), 4326)
        WHERE ride_id = ?`,
        [end_time, end_location, ride_id]
    );

    // Verificar si se actualizó algún registro
    if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Ride no encontrado' });
    }

    res.json({ message: 'Ride actualizado exitosamente' });

} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el ride' });
}
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
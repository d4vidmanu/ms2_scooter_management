import { pool } from "../db.js"

export const getScooters = async (req, res) => {
    const result = await pool.query('SELECT * FROM scooters')
    res.json(result[0])}

    export const createScooter = async (req, res) => {
        const { scooter_status, battery_level, location } = req.body;
    
        // Separar latitud y longitud a partir de la cadena de location
        const [lat, lng] = location.split(",").map(coord => parseFloat(coord.trim()));
    
        // Crear el valor de POINT para MySQL con el SRID 4326
        const point = `ST_GeomFromText('POINT(${lat} ${lng})', 4326)`;  // Especificar el SRID 4326
    
        // Ejecutar la consulta
        const [rows] = await pool.query(
            'INSERT INTO scooters (scooter_status, battery_level, location) VALUES (?, ?, ' + point + ')',
            [scooter_status, battery_level]
        );
    
        // Responder con el ID del scooter creado
        res.status(201).json({
            message: 'Scooter creado exitosamente',
            scooter_id: rows.insertId,
        });
    };

    export const updateScooter = async (req, res) => {
        const { scooter_status, battery_level, location } = req.body;
        const { scooter_id } = req.params;  // Se obtiene el ID del scooter desde los parámetros de la URL
    
        // Separar latitud y longitud a partir de la cadena de location
        const [lat, lng] = location.split(",").map(coord => parseFloat(coord.trim()));
    
        // Crear el valor de POINT para MySQL
        const point = `ST_GeomFromText('POINT(${lat} ${lng})', 4326)`;
    
        // Actualizar el scooter con los nuevos valores
        const [result] = await pool.query(
            'UPDATE scooters SET scooter_status = ?, battery_level = ?, location = ' + point + ' WHERE scooter_id = ?',
            [scooter_status, battery_level, scooter_id]
        );
    
        // Verificar si se actualizó algún registro
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Scooter no encontrado' });
        }
    
        res.json({ message: 'Scooter actualizado exitosamente' });
    };

    export const deleteScooter = async (req, res) => {
        const { scooter_id } = req.params;  // Se obtiene el ID del scooter desde los parámetros de la URL
    
        // Ejecutar la consulta para eliminar el scooter
        const [result] = await pool.query('DELETE FROM scooters WHERE scooter_id = ?', [scooter_id]);
    
        // Verificar si se eliminó algún registro
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Scooter no encontrado' });
        }
    
        res.json({ message: 'Scooter eliminado exitosamente' });
    };
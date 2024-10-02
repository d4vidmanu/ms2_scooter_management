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

    // Crear un array de campos y valores para actualizar dinámicamente
    const fields = [];
    const values = [];

    // Verificamos qué campos han sido proporcionados y los añadimos a la consulta
    if (scooter_status) {
        fields.push('scooter_status = ?');
        values.push(scooter_status);
    }
    if (battery_level) {
        fields.push('battery_level = ?');
        values.push(battery_level);
    }
    if (location) {
        // Separar latitud y longitud a partir de la cadena de location
        const [lat, lng] = location.split(",").map(coord => parseFloat(coord.trim()));
        const point = `ST_GeomFromText('POINT(${lat} ${lng})', 4326)`;
        fields.push(`location = ${point}`);
    }

    // Si no hay campos para actualizar, devolver un error
    if (fields.length === 0) {
        return res.status(400).json({ message: 'No hay campos para actualizar' });
    }

    // Construir la consulta SQL
    const query = `UPDATE scooters SET ${fields.join(', ')} WHERE scooter_id = ?`;
    values.push(scooter_id);  // Agregar scooter_id al final de los valores

    // Ejecutar la consulta SQL
    const [result] = await pool.query(query, values);

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
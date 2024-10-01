import { pool } from "../db.js"

export const getRide = async (req, res) => {
    const result = await pool.query('SELECT * FROM rides')
    res.json(result[0])}

export const createRide = (req, res) => res.send('creating ride')

export const updateRide = (req, res) => res.send('updating ride')

export const deleteRide = (req, res) => res.send('deleting ride')
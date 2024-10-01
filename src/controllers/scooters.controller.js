import { pool } from "../db.js"

export const getScooters = async (req, res) => {
    const result = await pool.query('SELECT * FROM scooters')
    res.json(result[0])}

export const createScooter = (req, res) => res.send('creating scooter')

export const updateScooter = (req, res) => res.send('updating scooter')

export const deleteScooter = (req, res) => res.send('deleting scooter')
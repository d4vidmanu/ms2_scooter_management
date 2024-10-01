import express from 'express';
import {pool} from './db.js';
import scooterRoutes from './routes/scooters.routes.js';
import rideRoutes from './routes/rides.routes.js';

const app = express();

app.use(scooterRoutes);

app.use(rideRoutes);


// app.get('/rides', async (req, res) => {
//     const result = await pool.query('SELECT * FROM rides')
//     res.json(result[0])
// });

app.listen(3000);
console.log('Server running on port 3000');
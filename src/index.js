import express from 'express';
import cors from 'cors';
import scooterRoutes from './routes/scooters.routes.js';
import rideRoutes from './routes/rides.routes.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173'
  }));

app.use(express.json());

app.use(scooterRoutes);

app.use(rideRoutes);

app.listen(3000);
console.log('Server running on port 3000');
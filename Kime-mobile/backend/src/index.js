import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './db/conn.js';
import authRoutes from './routes/authRoutes.js';

import menuRoutes from './routes/menuRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente');
});

app.use('/api/menu', menuRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  connectDB();
});

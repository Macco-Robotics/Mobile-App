import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './db/conn.js';

import menuRoutes from './routes/menuRoutes.js';
import userRoutes from './routes/userRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente');
});

app.use('/api/menu', menuRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ingredients', inventoryRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  connectDB();
});

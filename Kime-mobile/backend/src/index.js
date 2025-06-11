import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './db/conn.js';

import drinkRoutes from './routes/drinkRoutes.js';
import ingredientRoutes from './routes/ingredientRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import userRoutes from './routes/userRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';



dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/drink', drinkRoutes);
app.use('/api/menu', menuRoutes);

app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente');
});

app.use('/api/menu', menuRoutes);
app.use('/api/user', userRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/ingredient', ingredientRoutes);

app.use('/api/restaurants', restaurantRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  connectDB();
});

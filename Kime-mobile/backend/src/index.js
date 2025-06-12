import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './db/conn.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente');
});

const startServer = async () => {
  await connectDB();

  const { startIngredientSyncJob } = await import('./tasks/syncIngredientsJob.js');
  startIngredientSyncJob(); 
  
  const drinkRoutes = (await import('./routes/drinkRoutes.js')).default;
  const ingredientRoutes = (await import('./routes/ingredientRoutes.js')).default;
  const inventoryRoutes = (await import('./routes/inventoryRoutes.js')).default;
  const menuRoutes = (await import('./routes/menuRoutes.js')).default;
  const restaurantRoutes = (await import('./routes/restaurantRoutes.js')).default;
  const userRoutes = (await import('./routes/userRoutes.js')).default;

  app.use('/api/drink', drinkRoutes);
  app.use('/api/menu', menuRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/inventory', inventoryRoutes);
  app.use('/api/ingredient', ingredientRoutes);
  app.use('/api/restaurants', restaurantRoutes);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
};

startServer();

import express from 'express';
import { getAllInventories, getAllIngredients, getAllIngredientsWithQuantities, getInventoryByName, refillIngredient } from '../controllers/inventorycontroller.js';
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas públicas para inventario
router.get('/', getAllInventories);
router.get('/ingredients', getAllIngredients);
router.get('/ingredients/with-quantities', getAllIngredientsWithQuantities);
router.get('/:name', getInventoryByName);

// Ruta protegida para recarga de ingredientes
router.post('/refill', authMiddleware, authorizeRoles('owner'), refillIngredient);

export default router;

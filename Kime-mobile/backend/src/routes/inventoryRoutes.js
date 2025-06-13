import express from 'express';
import { getAllIngredients, getAllIngredientsWithQuantities, getAllInventories, getInventoryByName } from '../controllers/inventorycontroller.js';
import { loadTenantModels } from '../middleware/loadTenantModels.js';
import { withRestaurantSlug } from '../middleware/withSlugMiddleware.js';

const router = express.Router();

// Rutas públicas para inventario
router.get('/', withRestaurantSlug, loadTenantModels, getAllInventories);
router.get('/ingredients', withRestaurantSlug, loadTenantModels, getAllIngredients);
router.get('/ingredients/with-quantities', withRestaurantSlug, loadTenantModels, getAllIngredientsWithQuantities);
router.get('/:name', withRestaurantSlug, loadTenantModels, getInventoryByName);


export default router;

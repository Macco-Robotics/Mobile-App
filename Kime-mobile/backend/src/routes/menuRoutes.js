import express from 'express';
import { getAllDrinkTypes, getAllMenus, getProductById } from '../controllers/menuController.js';
import { loadTenantModels } from '../middleware/loadTenantModels.js';
import { withRestaurantSlug } from '../middleware/withSlugMiddleware.js';


const router = express.Router();

router.get('/', withRestaurantSlug, loadTenantModels, getAllMenus);
router.get('/product/:id', withRestaurantSlug, loadTenantModels, getProductById);
router.get('/types', withRestaurantSlug, loadTenantModels, getAllDrinkTypes);

export default router;

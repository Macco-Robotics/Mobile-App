import express from 'express';
import { getAllMenus, getAllDrinkTypes, getProductById} from '../controllers/menuController.js'; 
import { withRestaurantSlug } from '../middleware/withSlugMiddleware.js';


const router = express.Router();

router.get('/', withRestaurantSlug, getAllMenus);
router.get('/product/:id', getProductById);
router.get('/types', getAllDrinkTypes);

export default router;

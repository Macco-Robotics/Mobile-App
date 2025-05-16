import express from 'express';
import { getAllMenus, getAllDrinkTypes, getProductById} from '../controllers/menuController.js'; 


const router = express.Router();

router.get('/', getAllMenus);
router.get('/product/:id', getProductById);
router.get('/types', getAllDrinkTypes);

export default router;

import express from 'express';

import { createDrink, getAllPublishedDrinks, getDrinkById } from '../controllers/drinkController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/published', getAllPublishedDrinks);
router.get('/:id', authMiddleware, getDrinkById);
router.post('/', authMiddleware, createDrink);

export default router;
import express from 'express';

import {
    createDrink,
    getAllPublishedDrinks,
    getCreatedDrinksByCurrentUser,
    getDrinkById,
    getUserSavedDrinks,
    toggleLikeDrink,
    toggleSaveDrink,
    updateDrink
} from '../controllers/drinkController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/published', getAllPublishedDrinks);
router.get('/:id', authMiddleware, getDrinkById);
router.get('/me/created', authMiddleware, getCreatedDrinksByCurrentUser);
router.get('/me/saved', authMiddleware, getUserSavedDrinks);

router.post('/', authMiddleware, createDrink);
router.post('/:id/like', authMiddleware, toggleLikeDrink);
router.post('/:id/save', authMiddleware, toggleSaveDrink);

router.put('/:id', authMiddleware, updateDrink);

export default router;
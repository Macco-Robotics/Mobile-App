import express from 'express';

import { createDrink } from '../controllers/drinkController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createDrink);

export default router;
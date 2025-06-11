// src/routes/restaurantRoutes.js
import express from 'express';
import { getAllSlugs } from '../controllers/restaurantController.js';

const router = express.Router();

router.get('/slugs', getAllSlugs);

export default router;

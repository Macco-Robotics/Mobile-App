// src/controllers/restaurantController.js
import Restaurant from '../models/restaurant.js';

export const getAllSlugs = async (req, res) => {
  try {
    const slugs = await Restaurant.find({}, 'slug').lean();
    const uniqueSlugs = [...new Set(slugs.map(r => r.slug))];
    res.json(uniqueSlugs);
  } catch (err) {
    console.error('Error al obtener slugs:', err);
    res.status(500).json({ error: 'Error al obtener slugs' });
  }
};


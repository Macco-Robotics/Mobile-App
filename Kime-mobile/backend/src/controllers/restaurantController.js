// src/controllers/restaurantController.js
import { getRestaurantModel } from '../models/restaurant.js';
import { getDB2Connection } from '../db/conn.js';
import { getMenuModel } from '../models/menu.js';

export const getAllSlugs = async (req, res) => {
  try {
    const db2 = getDB2Connection();
    if (!db2) {
      console.error('❌ db2Connection no inicializada');
      return res.status(500).json({ error: 'Database no conectada' });
    }

    const Restaurant = getRestaurantModel(db2);
    const slugs = await Restaurant.find({}, 'slug').lean();
    const uniqueSlugs = [...new Set(slugs.map(r => r.slug))];
    res.json(uniqueSlugs);
  } catch (err) {
    console.error('Error al obtener slugs:', err);
    res.status(500).json({ error: 'Error al obtener slugs' });
  }
};

export const getMenuBySlug = async (req, res) => {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ error: 'Falta el parámetro slug' });
  }

  try {
    const uri = process.env.MONGO_URI;

    const tempConnection = await mongoose.createConnection(uri, {
      dbName: slug,
    });

    const Menu = getMenuModel(tempConnection);
    const items = await Menu.find().lean();

    await tempConnection.close();

    res.json(items);
  } catch (err) {
    console.error('❌ Error al obtener menú para la base:', slug, err);
    res.status(500).json({ error: 'Error interno al acceder a la base de datos' });
  }
};


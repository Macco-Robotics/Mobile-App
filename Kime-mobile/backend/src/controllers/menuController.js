import { getMenuModel } from '../models/menu.js';
import Inventory from '../models/inventory.js';

export const getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find();
    res.json(menus);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Menu.findById(req.params.id);
    if(!product) {
      return res.status(404).json({ message: 'Drink not found.' });
    }
    const ingredients = product.recipe;
    let quantity_available = Number.MAX_SAFE_INTEGER;
    for (const ingredient of ingredients) {
      const inventoryDB = await Inventory.findOne({ name: ingredient.name });
      
      if (!inventoryDB) {
        return res.status(404).json({ message: 'Ingredient not found.' });
      }
      
      ingredient.quantity_available = inventoryDB.quantity_available;
      quantity_available = Math.min(quantity_available, Math.floor(inventoryDB.quantity_available / ingredient.quantity));
    }
    product.quantity_available = quantity_available;
    res.json(product);
  } catch (error) {
    res.status(500).send('Server Error');
  }
}


export const getAllDrinkTypes = async (req, res) => {
  try {
    const menus = await Menu.find();
    const types = menus.map(menu => menu.type);

    res.json([...new Set(types)]);
  } catch (error) {
    res.status(500).send('Server Error');
  }
}


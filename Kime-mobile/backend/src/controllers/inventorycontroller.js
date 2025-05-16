import Inventory from "../models/inventory.js";

export const getAllInventories = async (req, res) => {
  try {
    const inventories = await Inventory.find();
    res.json(inventories);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving inventory.', error });
  }
};

export const getInventoryByName = async (req, res) => {
  const { name } = req.params;
  try {
    const inventory = await Inventory.findOne({ name });
    if (!inventory) {
      return res.status(404).json({ message: 'Ingredient not found.' });
    }
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Error getting inventory.', error });
  }
}

export const getAllIngredients = async (req, res) => {
  try {
    const inventories = await Inventory.find();
    const ingredients = inventories.filter(inventory => inventory.name !== 'ice')
      .map(inventory => inventory.name);

    res.json([...new Set(ingredients)]);
  } catch (error) {
    res.status(500).json({ message: 'Error getting ingredients.', error });
  }
};

export const getAllIngredientsWithQuantities = async (req, res) => {
  try {
    const ingredients = await Inventory.find({}, 'name quantity_available quantity_max'); // Incluye quantity_max
    res.json(ingredients);
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    res.status(500).json({ message: 'Error fetching ingredients', error });
  }
};

export const refillIngredient = async (req, res) => {
  try {
    const { name, amount } = req.body;

    if (!name || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid refill data' });
    }

    // Utiliza findOneAndUpdate con $inc para actualizar sólo quantity_available
    const updatedIngredient = await Inventory.findOneAndUpdate(
      { name },
      { $inc: { quantity_available: amount } },
      { new: true }
    );

    if (!updatedIngredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }

    res.json(updatedIngredient);
  } catch (error) {
    console.error('Error refilling ingredient:', error);
    res.status(500).json({ message: 'Error refilling ingredient', error });
  }
};

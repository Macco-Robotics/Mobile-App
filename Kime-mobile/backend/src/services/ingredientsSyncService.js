import { getTenantModels } from '../db/dynamicConn.js';
import Restaurant from '../models/restaurant.js';
import { syncIngredientsToMain } from '../services/ingredientService.js';

export const syncAllRestaurantsIngredients = async () => {
  const restaurants = await Restaurant.find();

  for (const restaurant of restaurants) {
    const dbName = restaurant.slug;
    const { Inventory } = await getTenantModels(dbName);
    const inventoryItems = await Inventory.find({});

    const ingredients = inventoryItems.map(item => ({
      name: item.name
    }));

    await syncIngredientsToMain(ingredients);
  }
};

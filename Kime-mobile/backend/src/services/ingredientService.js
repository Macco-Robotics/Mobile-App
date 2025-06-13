import Ingredient from '../models/ingredient.js';

export const syncIngredientsToMain = async (incomingIngredients = []) => {
  for (const ingredient of incomingIngredients) {
    const normalizedName = ingredient.name.trim().toLowerCase();

    const exists = await Ingredient.findOne({
      name: new RegExp(`^${normalizedName}$`, 'i'), // evita duplicados con distinto casing
    });

    if (!exists) {
      try {
        await Ingredient.create({
          name: normalizedName
        });
      } catch (err) {
        console.warn(`No se pudo insertar el ingrediente "${normalizedName}":`, err.message);
      }
    }
  }
};

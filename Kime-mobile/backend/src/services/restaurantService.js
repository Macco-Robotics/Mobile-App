import Restaurant from "../models/restaurant.js";

export const getDbNameBySlug = async (slug) => {
  const restaurant = await Restaurant.findOne({ slug });
  if (!restaurant) throw new Error('Restaurante no encontrado');

  return restaurant.dbName;
};

import Ingredient from '../models/ingredient.js';

export const getAllIngredients = async (req, res) => {
    try {
        const ingredients = await Ingredient.find();
        return res.status(200).json(ingredients);
    } catch (error) {
        console.log(error);
        return res.status(500).jsong({message: 'Error while retrieving ingredients'});
    }
}
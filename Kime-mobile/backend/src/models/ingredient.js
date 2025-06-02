import mongoose from "mongoose";

const ingredientSchema = mongoose.Schema({
    name: {type: String, required: true},
    type: {type: String, enum: ['Alcohol', 'Zumo', 'Fruta', 'Lácteo', 'Sirope', 'Decoración', 'Otro'], required: true},
    allergens: {type: [String]},
    createdAt: {type: Date, default: Date.now}
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

export default Ingredient;
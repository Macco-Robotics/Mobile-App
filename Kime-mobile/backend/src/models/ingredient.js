import mongoose from "mongoose";
import { getMainDatabase } from "../db/conn.js";

const ingredientSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    createdAt: {type: Date, default: Date.now}
});

const Ingredient = getMainDatabase().model('Ingredient', ingredientSchema);
export default Ingredient;
import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: false },
}, { _id: false });

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  is_available: { type: Boolean, default: true },
  last_updated_timestamp: { type: Date, default: Date.now },
  display_name: { type: String, required: true },
  description: { type: String, required: true },
  quantity_available: { type: Number, required: true },
  type: { type: String, required: true },
  icon: { type: String, required: true },
  price_value: { type: Number, required: true },
  price_currency: { type: String, required: true },
  recipe: [recipeSchema],
}, { collection: "menu" });

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;

import mongoose from "mongoose";

const drinkSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    type: { type: String, enum: ['Cóctel', 'Smoothie', 'Infusión', 'Zumo', 'Bebida energética', 'Refresco'], required: true },
    ingredients: [{
        ingredient: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true },
        quantity: { type: Number, required: true }
    }],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likes: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Drink = mongoose.model('Drink', drinkSchema);

export default Drink;

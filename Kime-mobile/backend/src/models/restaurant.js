import mongoose from 'mongoose';
import { getMainDatabase } from '../db/conn.js';

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
}, {
  _id: true,
  versionKey: false,
});

let Restaurant;
try {
  Restaurant = getMainDatabase().model('Restaurant');
} catch (e) {
  Restaurant = getMainDatabase().model('Restaurant', restaurantSchema);
}

export default Restaurant;


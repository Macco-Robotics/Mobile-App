import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
}, {
  _id: true,
  versionKey: false,
});

export const getRestaurantModel = (connection) => {
  return connection.model('Restaurant', restaurantSchema, 'restaurants');
};

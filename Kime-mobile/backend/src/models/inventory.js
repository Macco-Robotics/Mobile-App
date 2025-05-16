import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const inventorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity_available: {
      type: Number,
      required: true,
      min: [0, 'The quantity_available cannot be negative.'],
    },
    quantity_max: {
      type: Number,
      required: true,
      min: [0, 'The quantity_max cannot be negative.'],
    },
    quantity_min: {
      type: Number,
      required: true,
      min: [0, 'The quantity_min cannot be negative.'],
    },
    quantity_unit: {
      type: String,
      required: true,
      enum: ['ml', 'l', 'g', 'kg', 'ud'],
    },
    availability: {
      type: Boolean,
      required: true,
      default: true,
    },
    brand_place: {
      type: Number,
      required: false,
    },
    last_updated_timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { collection: 'inventory' }
);

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;

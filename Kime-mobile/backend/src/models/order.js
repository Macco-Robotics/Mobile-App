import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product_name: { type: String, required: true },
  order_quantity: { type: Number, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  items: { type: Number, required: true },
  order_items: { type: [orderItemSchema], required: true },
  order_number: { type: Number, required: true },
  total_price_value: { type: String, required: false, default: '0' },
  order_status: { type: String, required: true },
  human_readable_order_id: { type: String, required: false },
  service_platform: { type: Number, required: true },
  last_updated_timestamp: { type: Date, default: Date.now },
  kiosks_id : { type: String, required: true }
}, { collection: "orders", versionKey: false });

export default mongoose.model('Order', orderSchema);

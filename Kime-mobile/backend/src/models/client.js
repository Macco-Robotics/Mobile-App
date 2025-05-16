import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  user_name: { type: String, required: true },
  user_id: { type: String, required: true, unique: true },
  cups_in_retireve: { type: Number, default: 0 },
  allowed_to_order: { type: Boolean, default: true }
}, { collection: 'clients' });  

const Client = mongoose.model('Client', clientSchema);

export default Client;

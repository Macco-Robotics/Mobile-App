import mongoose from 'mongoose';
import inventorySchema from '../models/inventory.js';
import menuSchema from '../models/menu.js';
import orderSchema from '../models/order.js';

const connections = {};

export const getTenantModels = async (dbName) => {
  if (!connections[dbName]) {
    const uri = process.env.MONGO_URI;
    const conn = mongoose.createConnection(uri, {
      dbName,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`[MongoDB] Conectado a base de datos del restaurante: ${dbName}`);

    connections[dbName] = {
      conn,
      Order: conn.model('Order', orderSchema),
      Menu: conn.model('Menu', menuSchema),
      Inventory: conn.model('Inventory', inventorySchema)
    };
  }

  return connections[dbName];
};

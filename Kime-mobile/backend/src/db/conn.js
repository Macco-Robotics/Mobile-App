// src/db/conn.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const uri = process.env.MONGO_URI || '';
const dbRobot = process.env.MONGO_DB_NAME || '';
const dbMain = process.env.MONGO_MAIN_DATABASE || '';

let db1Connection;
let db2Connection;

const connectDB = async () => {
  try {
    db1Connection = await mongoose.createConnection(uri, {
      dbName: dbRobot,
    });
    console.log(`MongoDB 1 conectado a: ${dbRobot}`);

    db2Connection = await mongoose.createConnection(uri, {
      dbName: dbMain,
    });
    console.log(`MongoDB 2 conectado a: ${dbMain}`);
  } catch (error) {
    console.error('Error al conectar a MongoDBs:', error);
    process.exit(1);
  }
};

// En lugar de exportar las conexiones directamente, exportamos funciones para obtenerlas cuando ya estén listas
const getDB1Connection = () => db1Connection;
const getDB2Connection = () => db2Connection;

export { connectDB, getDB1Connection, getDB2Connection };

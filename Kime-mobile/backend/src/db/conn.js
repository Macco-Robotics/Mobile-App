// src/db/conn.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const uri = process.env.MONGO_URI || '';
const dbMain = process.env.MONGO_MAIN_DATABASE || '';

let mainConnection;

const connectDB = async () => {
  try {
    mainConnection = mongoose.createConnection(uri, {
      dbName: dbMain,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB conectado a base MAIN: ${dbMain}`);
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

const getMainDatabase = () => {
  if (!mainConnection) {
    throw new Error('La conexión aún no ha sido establecida. ¿Has llamado a connectDB()?');
  }
  return mainConnection;
};

export { connectDB, getMainDatabase };


import dotenv from 'dotenv';
import mongoose from "mongoose";

dotenv.config();
const connection = process.env.MONGO_URI || "";
const dbName = process.env.MONGO_DB_NAME || "";

export const connectDB = async () => {
    try {
        await mongoose.connect(connection, {
            dbName: dbName,
        });

        console.log("MongoDB conectado exitosamente!");
        console.log(dbName);

    } catch (error) {
        console.error("Error al conectar MongoDB:", error);
        process.exit(1);
    }
};
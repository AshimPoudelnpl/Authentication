import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?:number;
}

const connection :ConnectionObject = {}

async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log("Already connected to database");
        return;
    }

    try {
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new Error("MONGODB_URI is not set");
        }

        if (mongoUri.includes("<") || mongoUri.includes(">")) {
            throw new Error(
                "MONGODB_URI still contains placeholder brackets. Remove the < and > around your MongoDB password."
            );
        }

        const db = await mongoose.connect(mongoUri);
        connection.isConnected = db.connections[0].readyState;
        console.log(connection);
        console.log("DB Connected Succesfully");

    } catch (error) {
        console.error("Database connection failed", error);
        throw error;
    }
}

export default dbConnect;

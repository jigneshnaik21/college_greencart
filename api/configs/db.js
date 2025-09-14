import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log("Database already connected");
        return;
    }

    try {
        if (mongoose.connection.readyState === 1) {
            console.log("Database already connected");
            isConnected = true;
            return;
        }

        mongoose.connection.on('connected', () => {
            console.log("Database Connected");
            isConnected = true;
        });

        mongoose.connection.on('error', (err) => {
            console.error("Database connection error:", err);
            isConnected = false;
        });

        mongoose.connection.on('disconnected', () => {
            console.log("Database disconnected");
            isConnected = false;
        });

        await mongoose.connect(process.env.MONGODB_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
    } catch (error) {
        console.error("Database connection error:", error.message);
        isConnected = false;
        throw error;
    }
}

export { connectDB };

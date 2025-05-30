import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGDB_URL);
        console.log(`Database connected at: ${connection.connection.host}`);
    } catch (error) {
        console.log(error);
    }
};
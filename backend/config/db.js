import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()
const uri = `mongodb+srv://jayapramodmanikantan:${process.env.MONGODB_PASSWORD}@cluster0.2pcy8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
export async function connectDB() {
    await mongoose.connect(uri, {dbName: "agrox"});
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. Successfully connected to MongoDB!");
}
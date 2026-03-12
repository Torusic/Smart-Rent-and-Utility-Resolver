import mongoose  from "mongoose";
import dotenv from 'dotenv'

dotenv.config();
async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongDB connected successfully")
        

    } catch (error) {
        console.log("MongDB connection failed")
        console.error("MongoDB connection failed:", error.message);
        
    }
}
export default connectDB
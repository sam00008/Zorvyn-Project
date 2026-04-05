import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const connectDB = async () => {
   try {
      const mongoURL = process.env.MONGO_URL;
  
  if(!mongoURL){
    throw new ApiError(500,"Mongo URL is missing.Please check your .env file");
  }

  await mongoose.connect(mongoURL);

    console.log("MongoDB connected Successfully");

   } catch (error) {
    console.log("MongoDB connection error : ", error.message);
    throw error;
   }
}

export { connectDB };
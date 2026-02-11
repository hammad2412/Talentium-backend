import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected `.cyan.underline.bold);
  } catch (error) {
    console.error("MongoDB connection failed".red.bold, error.message);
    process.exit(1);
  }
};

export default connectDB;

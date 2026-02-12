import mongoose from "../src/lib/mongoose.js";
import colors from "colors";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `MongoDB connected ${mongoose.connection.name}`.cyan.underline.bold,
    );
  } catch (error) {
    console.error("MongoDB connection failed".red.bold, error.message);
    process.exit(1);
  }
};

export default connectDB;

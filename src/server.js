//Load env vars
import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./config/config.env" });
}

import app from "./app.js";
import connectDB from "../config/db.js";

// Environment variables
const PORT = process.env.PORT || 5000;

// ---------- START SERVER ----------
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.green
        .bold,
    );
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });

  // Handle uncaught exceptions
  process.on("uncaughtException", (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
  });
};

startServer();

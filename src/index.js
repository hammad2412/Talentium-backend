import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables first
dotenv.config({
  path: path.join(__dirname, "../config/config.env"),
});

// Import server only after env variables are loaded
await import("./server.js");

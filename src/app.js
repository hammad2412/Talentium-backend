// src/app.js

import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
//routes
import authRoutes from "./routes/auth.routes.js";
import companyRoutes from "./routes/company.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import candidateProfileRoutes from "./routes/candidateProfile.routes.js";
import userRoutes from "./routes/user.routes.js";
//error handler
import errorHandler from "./middlewares/error.middleware.js";
//security
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import cors from "cors";

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log("Incoming Request:", req.method, req.originalUrl);
    next();
  });
}

// ---------- GLOBAL MIDDLEWARES ----------

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());

// CORS
const allowedOrigin =
  process.env.NODE_ENV === "production"
    ? process.env.CLIENT_URL
    : "http://localhost:5173";
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  }),
);

// HTTP request logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Security headers
app.use(helmet());

// Prevent NoSQL injection
//app.use(mongoSanitize());

// Prevent XSS attacks
//app.use(xss());

// Prevent HTTP param pollution
app.use(hpp());

// Rate limiting (auth routes protection)
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // 100 requests per IP
  message: "Too many requests, please try again later",
});

app.use("/api", limiter);

// Mount Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/candidate-profile", candidateProfileRoutes);
app.use("/api/v1/users", userRoutes);

// ---------- HEALTH CHECK ----------
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ---------- 404 HANDLER ----------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

//error handler
app.use(errorHandler);

export default app;

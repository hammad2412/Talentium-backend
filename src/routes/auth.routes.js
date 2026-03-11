import express from "express";
import {
  login,
  registerCandidate,
  registerRecruiter,
  refreshAccessToken,
  logout,
  getMe,
} from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", validate(loginSchema), login);

router.post("/refresh", refreshAccessToken);

router.post("/register/candidate", validate(registerSchema), registerCandidate);

router.post("/register/recruiter", validate(registerSchema), registerRecruiter);

router.post("/logout", protect, logout);

router.get("/me", protect, getMe);

export default router;

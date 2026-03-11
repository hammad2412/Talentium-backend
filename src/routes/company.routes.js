import express from "express";
import {
  createCompany,
  getMyCompany,
  updateCompany,
} from "../controllers/company.controller.js";
import protect from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { createCompanySchema } from "../validations/company.validation.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("recruiter"),
  validate(createCompanySchema),
  createCompany,
);

router.get("/me", protect, authorize("recruiter"), getMyCompany);

router.put("/", protect, authorize("recruiter"), updateCompany);

export default router;

import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getAdherenceReport } from "../controllers/reportController.js";

const router = express.Router();

router.get("/adherence", authMiddleware, getAdherenceReport);

export default router;
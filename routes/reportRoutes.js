import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getAdherenceReport, getStreakReport } from "../controllers/reportController.js";

const router = express.Router();

router.get("/adherence", authMiddleware, getAdherenceReport);
router.get("/streak", authMiddleware, getStreakReport);

export default router;
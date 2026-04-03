import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { askHealthAssistant } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", authMiddleware, askHealthAssistant);

export default router;
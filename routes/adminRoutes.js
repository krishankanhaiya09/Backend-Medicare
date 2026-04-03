import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
  getPendingDoctors,
  approveDoctor
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/pending-doctors", authMiddleware, adminMiddleware, getPendingDoctors);
router.put("/approve-doctor/:id", authMiddleware, adminMiddleware, approveDoctor);

export default router;
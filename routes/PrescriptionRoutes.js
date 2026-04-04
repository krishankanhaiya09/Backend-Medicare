import express from "express";
import upload from "../middleware/upload.js";
import { uploadPrescription } from "../controllers/PrescriptionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/upload", authMiddleware, upload.single("prescription"), uploadPrescription);

export default router;
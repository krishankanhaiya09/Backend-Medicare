import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import doctorMiddleware from "../middleware/doctorMiddleware.js";
import {
  getAllPatients,
  getPatientMedicines,
  getPatientReport
} from "../controllers/doctorController.js";

const router = express.Router();

router.get("/patients", authMiddleware, doctorMiddleware, getAllPatients);
router.get("/patients/:patientId/medicines", authMiddleware, doctorMiddleware, getPatientMedicines);
router.get("/patients/:patientId/report", authMiddleware, doctorMiddleware, getPatientReport);

export default router;
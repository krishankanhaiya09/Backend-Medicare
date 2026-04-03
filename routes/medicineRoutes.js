import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addMedicine,
  getMedicines,
  updateMedicine,
  deleteMedicine,
  markDoseStatus
} from "../controllers/medicineController.js";

const router = express.Router();

router.post("/", authMiddleware, addMedicine);
router.get("/", authMiddleware, getMedicines);
router.put("/:id", authMiddleware, updateMedicine);
router.delete("/:id", authMiddleware, deleteMedicine);
router.post("/log-dose", authMiddleware, markDoseStatus);

export default router;
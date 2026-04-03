import User from "../models/User.js";
import Medicine from "../models/Medicine.js";
import DoseLog from "../models/DoseLog.js";
import { calculateAdherence } from "../utils/adherence.js";

export const getAllPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" }).select("name email");

    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPatientMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ user: req.params.patientId });

    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPatientReport = async (req, res) => {
  try {
    const logs = await DoseLog.find({ user: req.params.patientId }).populate("medicine");
    const report = calculateAdherence(logs);

    const alert =
      report.missed >= 3
        ? "High non-adherence risk"
        : "Medication adherence looks stable";

    res.status(200).json({
      report,
      alert
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
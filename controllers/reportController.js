import DoseLog from "../models/Doselog.js";
import { calculateAdherence } from "../utils/adherence.js";

export const getAdherenceReport = async (req, res) => {
  try {
    const logs = await DoseLog.find({ user: req.user.id }).populate("medicine");

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
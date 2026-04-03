import Medicine from "../models/Medicine.js";
import DoseLog from "../models/Doselog.js";

export const addMedicine = async (req, res) => {
  try {
    const {
      medicineName,
      dosage,
      frequencyPerDay,
      times,
      startDate,
      endDate,
      instructions
    } = req.body;

    const medicine = await Medicine.create({
      user: req.user.id,
      medicineName,
      dosage,
      frequencyPerDay,
      times,
      startDate,
      endDate,
      instructions
    });

    res.status(201).json({
      message: "Medicine added successfully",
      medicine
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMedicine = async (req, res) => {
  try {
    const updatedMedicine = await Medicine.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!updatedMedicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.status(200).json({
      message: "Medicine updated successfully",
      updatedMedicine
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMedicine = async (req, res) => {
  try {
    const deletedMedicine = await Medicine.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!deletedMedicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.status(200).json({ message: "Medicine deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markDoseStatus = async (req, res) => {
  try {
    const { medicineId, scheduledTime, date, status } = req.body;

    const doseLog = await DoseLog.create({
      user: req.user.id,
      medicine: medicineId,
      scheduledTime,
      date,
      status,
      takenAt: status === "taken" || status === "delayed" ? new Date() : null
    });

    res.status(201).json({
      message: "Dose log saved successfully",
      doseLog
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
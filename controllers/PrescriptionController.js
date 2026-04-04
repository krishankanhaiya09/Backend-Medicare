import Prescription from "../models/Prescription.js";

export const uploadPrescription = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a prescription file" });
    }

    const prescription = await Prescription.create({
      user: req.user.id,
      fileUrl: `/uploads/${req.file.filename}`,
      originalName: req.file.originalname,
      note: req.body.note || "",
      status: "pending",
      message:
        "Prescription uploaded successfully. Caretaker will add the needed medicine schedule.",
    });

    res.status(201).json({
      message:
        "Prescription uploaded successfully. Caretaker will add the needed medicine schedule.",
      prescription,
    });
  } catch (error) {
    res.status(500).json({
      message: "Prescription upload failed",
      error: error.message,
    });
  }
};
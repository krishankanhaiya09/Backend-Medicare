import User from "../models/User.js";

export const getPendingDoctors = async (req, res) => {
  try {
    const doctors = await User.find({
      role: "doctor",
      isApproved: false
    }).select("-password");

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveDoctor = async (req, res) => {
  try {
    const doctor = await User.findOneAndUpdate(
      {
        _id: req.params.id,
        role: "doctor"
      },
      {
        isApproved: true,
        approvedBy: req.user.id
      },
      { new: true }
    ).select("-password");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({
      message: "Doctor approved successfully",
      doctor
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
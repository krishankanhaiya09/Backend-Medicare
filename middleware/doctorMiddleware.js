const doctorMiddleware = (req, res, next) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Doctor access only" });
    }

    if (!req.user.isApproved) {
      return res.status(403).json({ message: "Doctor account not approved yet" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default doctorMiddleware;
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (!phone.startsWith("+91")) {
      return res.status(400).json({ message: "Phone number must start with +91" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let finalRole = role || "patient";
    let isApproved = false;

    if (email === "kanhaiya057@gmail.com") {
      finalRole = "admin";
      isApproved = true;
    } else if (finalRole === "patient" || finalRole === "caregiver") {
      isApproved = true;
    } else if (finalRole === "doctor") {
      isApproved = false;
    }

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: finalRole,
      isApproved
    });

    const customMessage =
      finalRole === "doctor" && !isApproved
        ? "Doctor signup successful. Waiting for admin approval."
        : "Signup successful";

    res.status(201).json({
      message: customMessage,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isApproved: user.isApproved
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, deviceToken } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.role === "doctor" && !user.isApproved) {
      return res.status(403).json({
        message: "Doctor account pending admin approval"
      });
    }

    if (deviceToken) {
      user.deviceToken = deviceToken;
      await user.save();
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        isApproved: user.isApproved,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
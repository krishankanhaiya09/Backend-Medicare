import express from 'express'
import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import startReminderCron from "./utils/reminderCron.js";
import "./cron/Reminder.js"; 
import path from "path";

import prescriptionRoutes from "./routes/PrescriptionRoutes.js";
dotenv.config();

const PORT = process.env.PORT || 5000;
import testRoutes from "./routes/testRoutes.js";
app.use("/uploads", express.static("uploads"));
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api", testRoutes);
connectDB();
app.get("/health", (req, res) => {
  res.send("OK");
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startReminderCron();
});
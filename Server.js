import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import startReminderCron from "./utils/reminderCron.js";
import "./cron/Reminder.js"; 

dotenv.config();

const PORT = process.env.PORT || 5000;
import testRoutes from "./routes/testRoutes.js";

app.use("/api", testRoutes);
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startReminderCron();
});
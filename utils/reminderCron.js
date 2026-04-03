import cron from "node-cron";
import Medicine from "../models/Medicine.js";
import User from "../models/User.js";
import sendWhatsApp from "./sendWhatsApp.js";

const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getTargetTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 10);

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

const normalizeDate = (dateValue) => {
  const date = new Date(dateValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const startReminderCron = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const today = getTodayDateString();
      const targetTime = getTargetTime();

      console.log("Checking reminder for date:", today, "time:", targetTime);

      const medicines = await Medicine.find({ isActive: true }).populate("user");

      for (const medicine of medicines) {
        const medicineStartDate = normalizeDate(medicine.startDate);
        const medicineEndDate = medicine.endDate
          ? normalizeDate(medicine.endDate)
          : null;

        const isWithinDateRange =
          medicineStartDate <= today && (!medicineEndDate || medicineEndDate >= today);

        if (!isWithinDateRange) continue;

        if (!medicine.times || !medicine.times.includes(targetTime)) continue;

        let phone = medicine.user?.phone;

        if (!phone && medicine.user?._id) {
          const user = await User.findById(medicine.user._id);
          phone = user?.phone;
        }

        if (!phone) {
          console.log(`Phone missing for medicine ${medicine.medicineName}`);
          continue;
        }

        const message =
          `Reminder: Aapki medicine "${medicine.medicineName}" ` +
          `${targetTime} par leni hai.\n` +
          `Dose: ${medicine.dosage}\n` +
          `Please 10 minute baad medicine le lena🫦🫦🫦🫦`;

        await sendWhatsApp({
          to: phone,
          message,
        });

        console.log(`WhatsApp reminder sent to ${phone} for ${medicine.medicineName}`);
      }
    } catch (error) {
      console.log("Reminder cron error:", error.message);
    }
  });
};

export default startReminderCron;
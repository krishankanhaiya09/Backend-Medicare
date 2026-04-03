import cron from "node-cron";
import Medicine from "../models/Medicine.js";
import User from "../models/User.js";
import sendWhatsApp from "./sendWhatsApp.js";

const getIndiaNow = () => {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
};

const formatDate = (dateValue) => {
  const date = new Date(dateValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const normalizeTime = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const getTargetTime = () => {
  const now = getIndiaNow();
  now.setMinutes(now.getMinutes() + 10);

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

const startReminderCron = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = getIndiaNow();
      const today = formatDate(now);
      const targetTime = getTargetTime();

      console.log("Checking reminder for date:", today, "time:", targetTime);

      const medicines = await Medicine.find({ isActive: true }).populate("user");

      for (const medicine of medicines) {
        const medicineStartDate = formatDate(medicine.startDate);
        const medicineEndDate = medicine.endDate
          ? formatDate(medicine.endDate)
          : null;

        const isWithinDateRange =
          medicineStartDate <= today &&
          (!medicineEndDate || medicineEndDate >= today);

        if (!isWithinDateRange) continue;
        if (!medicine.times || !Array.isArray(medicine.times)) continue;

        const normalizedTimes = medicine.times.map((time) => normalizeTime(time));

        console.log(
          `Medicine: ${medicine.medicineName}, Saved Times: ${normalizedTimes.join(", ")}, TargetTime: ${targetTime}`
        );

        if (!normalizedTimes.includes(targetTime)) continue;

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
          `Please 10 minute baad medicine le lena.`;

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
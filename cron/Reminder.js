import cron from "node-cron";
import Medicine from "../models/Medicine.js";
import User from "../models/User.js";
import sendWhatsApp from "../utils/sendWhatsApp.js";

const toMinutes = (timeStr) => {
  const [hour, minute] = timeStr.split(":").map(Number);
  return hour * 60 + minute;
};

const formatTime12Hour = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${ampm}`;
};

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    console.log("Checking reminder time:", now.toLocaleTimeString());

    const medicines = await Medicine.find().populate("user");

    for (const med of medicines) {
      if (!med.times || !Array.isArray(med.times)) continue;

      for (const time of med.times) {
        const medicineMinutes = toMinutes(time);

        let reminderMinutes = medicineMinutes - 10;
        if (reminderMinutes < 0) {
          reminderMinutes += 24 * 60;
        }

        console.log(
          `Medicine: ${med.medicineName}, Time: ${time}, ReminderMinutes: ${reminderMinutes}, CurrentMinutes: ${currentMinutes}`
        );

        if (currentMinutes === reminderMinutes) {
          const user = med.user || (await User.findById(med.user));
          if (!user?.phone) {
            console.log(`No phone found for user of medicine ${med.medicineName}`);
            continue;
          }

          const msg = `Gentle reminder 💊\nHi ${user.name || "Patient"}, your medicine "${med.medicineName}" is scheduled at ${formatTime12Hour(time)}.\nPlease take it on time.`;

          await sendWhatsApp({
            to: user.phone,
            message: msg,
          });

          console.log(
            `WhatsApp reminder sent to ${user.phone} for ${med.medicineName}`
          );
        }
      }
    }
  } catch (error) {
    console.log("Reminder cron error:", error.message);
  }
});
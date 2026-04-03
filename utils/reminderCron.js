import cron from "node-cron";
import admin from "./firebase.js";
import Medicine from "../models/Medicine.js";
import { sendSMS } from "./sendSms.js";

const startReminderCron = () => {
  console.log("⏰ Reminder Cron Started...");

  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);

      console.log("⏱ Checking time:", currentTime);

      const medicines = await Medicine.find().populate("user");

      for (let med of medicines) {
        if (!med.times || !Array.isArray(med.times)) continue;

        console.log(`💊 Medicine: ${med.medicineName}, Times:`, med.times);

        for (let time of med.times) {
          const cleanTime = String(time).trim();

          console.log(`➡ Comparing DB time ${cleanTime} with current time ${currentTime}`);

          if (cleanTime === currentTime) {
            const user = med.user;

            console.log("🔔 Reminder Triggered!");
            console.log(`User: ${user?.name}`);
            console.log(`Medicine: ${med.medicineName}`);
            console.log(`Matched Time: ${cleanTime}`);
            console.log(`Device Token: ${user?.deviceToken ? "YES" : "NO"}`);
            console.log(`Phone: ${user?.phone ? user.phone : "NO PHONE"}`);

            let pushSent = false;

            if (user?.deviceToken) {
              try {
                await admin.messaging().send({
                  token: user.deviceToken,
                  notification: {
                    title: "Medicine Reminder 💊",
                    body: `Time to take ${med.medicineName}`,
                  },
                });

                console.log("✅ Push sent successfully");
                pushSent = true;
              } catch (err) {
                console.log("❌ Push failed:", err.message);
              }
            }

            if (!pushSent && user?.phone) {
              await sendSMS(
                user.phone,
                `Time to take your medicine: ${med.medicineName}`
              );
            }

            if (!pushSent && !user?.phone) {
              console.log("⚠ No deviceToken and no phone number. Nothing to send.");
            }
          }
        }
      }
    } catch (error) {
      console.log("❌ Cron Error:", error.message);
    }
  });
};

export default startReminderCron;
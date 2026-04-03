import cron from "node-cron";
import admin from "../utils/firebase.js";
import Medicine from "../models/Medicine.js";
import { sendSMS } from "../utils/sendSms.js";

cron.schedule("* * * * *", async () => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);

  const medicines = await Medicine.find().populate("user");

  for (let med of medicines) {
    if (!med.times) continue;

    for (let time of med.times) {
      if (time === currentTime) {
        const user = med.user;

        let pushSent = false;

        // 🔔 PUSH
        if (user.deviceToken) {
          try {
            await admin.messaging().send({
              token: user.deviceToken,
              notification: {
                title: "Medicine Reminder 💊",
                body: `Time to take ${med.medicineName}`,
              },
            });
            pushSent = true;
          } catch (err) {
            console.log("Push failed");
          }
        }

        // 📩 SMS fallback
        if (!pushSent && user.phone) {
          await sendSMS(
            user.phone,
            `Time to take ${med.medicineName}`
          );
        }
      }
    }
  }
});
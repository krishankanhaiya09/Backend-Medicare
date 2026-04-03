import DoseLog from "../models/Doselog.js";
import { calculateAdherence } from "../utils/adherence.js";

export const getAdherenceReport = async (req, res) => {
  try {
    const logs = await DoseLog.find({ user: req.user.id }).populate("medicine");

    const report = calculateAdherence(logs);

    const alert =
      report.missed >= 3
        ? "High non-adherence risk"
        : "Medication adherence looks stable";

    res.status(200).json({
      report,
      alert
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStreakReport = async (req, res) => {
  try {
    const logs = await DoseLog.find({ user: req.user.id }).sort({ date: 1, createdAt: 1 });

    if (!logs.length) {
      return res.status(200).json({
        currentStreak: 0,
        longestStreak: 0,
        todayStatus: "no-data",
        streakDates: []
      });
    }

    const groupedByDate = {};

    for (const log of logs) {
      const day = log.date;

      if (!groupedByDate[day]) {
        groupedByDate[day] = [];
      }

      groupedByDate[day].push(log);
    }

    const streakDates = Object.keys(groupedByDate).sort();

    const successfulDays = streakDates.map((day) => {
      const dayLogs = groupedByDate[day];

      const hasMissed = dayLogs.some((log) => log.status === "missed");
      const hasTakenOrDelayed = dayLogs.some(
        (log) => log.status === "taken" || log.status === "delayed"
      );

      return {
        date: day,
        success: !hasMissed && hasTakenOrDelayed
      };
    });

    let longestStreak = 0;
    let currentRun = 0;

    for (const day of successfulDays) {
      if (day.success) {
        currentRun += 1;
        if (currentRun > longestStreak) {
          longestStreak = currentRun;
        }
      } else {
        currentRun = 0;
      }
    }

    let currentStreak = 0;

    for (let i = successfulDays.length - 1; i >= 0; i--) {
      if (successfulDays[i].success) {
        currentStreak += 1;
      } else {
        break;
      }
    }

    const today = new Date();
    const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const todayEntry = successfulDays.find((day) => day.date === todayDate);

    const todayStatus = todayEntry
      ? todayEntry.success
        ? "success"
        : "failed"
      : "no-data";

    res.status(200).json({
      currentStreak,
      longestStreak,
      todayStatus,
      streakDates: successfulDays
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
import mongoose from "mongoose";

const doseLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true
    },

    scheduledTime: {
      type: String,
      required: true
    },

    date: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["taken", "missed", "delayed"],
      required: true
    },

    takenAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model("DoseLog", doseLogSchema);
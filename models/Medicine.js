import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    medicineName: {
      type: String,
      required: true
    },

    dosage: {
      type: String,
      required: true
    },

    frequencyPerDay: {
      type: Number,
      required: true
    },

    times: [
      {
        type: String
      }
    ],

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date
    },

    instructions: {
      type: String
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Medicine", medicineSchema);
import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "pending",
    },
    message: {
      type: String,
      default:
        "Prescription uploaded successfully. Caretaker will add the needed medicine schedule.",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Prescription", prescriptionSchema);
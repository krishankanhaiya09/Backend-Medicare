import express from "express";
import sendWhatsApp from "../utils/sendWhatsApp.js";

const router = express.Router();

router.get("/test-whatsapp", async (req, res) => {
  try {
    const result = await sendWhatsApp({
      to: "+919142264379",
      message: "Test WhatsApp message from Crafthon",
    });

    res.json({ success: true, result });
  } catch (error) {
    console.log("TWILIO FULL ERROR:", error);
    console.log("TWILIO MESSAGE:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
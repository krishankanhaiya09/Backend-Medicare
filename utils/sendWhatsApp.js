import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendWhatsApp = async ({ to, message }) => {
  try {
    const formattedTo = to.startsWith("whatsapp:")
      ? to
      : `whatsapp:${to}`;

    const res = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: formattedTo,
      body: message,
    });

    console.log("WhatsApp sent:", res.sid);
    return res;
  } catch (error) {
    console.log("WhatsApp send error:", error.message);
    throw error;
  }
};

export default sendWhatsApp;
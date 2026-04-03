import "dotenv/config";
import twilio from "twilio";

const sendWhatsApp = async ({ to, message }) => {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  const formattedTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;

  const result = await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_NUMBER,
    to: formattedTo,
    body: message,
  });

  return result;
};

export default sendWhatsApp;
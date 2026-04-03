import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export const askHealthAssistant = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const response = await client.chat.completions.create({
      model: "openrouter/free",
      messages: [
        {
          role: "system",
          content: `You are MediTrack AI Health Assistant.

Rules:
- Give only general educational health information.
- Do not diagnose diseases.
- Do not prescribe medicines or treatment plans.
- Keep answers short, clear, and patient-friendly.
- If the user mentions chest pain, trouble breathing, overdose, unconsciousness, seizures, severe bleeding, or emergency symptoms, tell them to seek urgent medical help immediately.
- If asked about a medicine, explain general uses, common side effects, basic precautions, and when to talk to a doctor.
- Always end with: "This is general guidance, not a medical diagnosis."`
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply =
      response.choices?.[0]?.message?.content ||
      "Sorry, I could not generate a response right now.";

    res.status(200).json({ reply });
  } catch (error) {
    console.log("OpenRouter AI Chat Error:", error.message);
    res.status(500).json({
      message: "Failed to get AI response",
      error: error.message,
    });
  }
};
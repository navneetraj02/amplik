import { VercelRequest, VercelResponse } from "@vercel/node";
import Groq from "groq-sdk";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

const groq = new Groq({
  apiKey: GROQ_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, systemInstruction } = req.body;

    if (!GROQ_API_KEY) {
      return res.status(500).json({ error: "Groq API Key not configured on server" });
    }

    // Convert messages to Groq/OpenAI format
    const chatMessages = [
      { role: "system", content: systemInstruction },
      ...messages.map((m: any) => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.content,
      })),
    ];

    const completion = await groq.chat.completions.create({
      messages: chatMessages,
      model: "llama-3.1-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    const responseText = completion.choices[0]?.message?.content || "";

    return res.status(200).json({ text: responseText });
  } catch (error: any) {
    console.error("Groq API error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}

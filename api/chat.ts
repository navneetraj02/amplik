import { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY || "";

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

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: "API Key not configured on server" });
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest", 
      systemInstruction,
    });

    // Format history for Gemini
    // Ensure history starts with user and alternates
    let history = (messages || []).map((m: any) => ({
      role: m.role === "ai" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // Remove last message as it's the current prompt
    const lastMessage = history.pop();
    const prompt = lastMessage?.parts[0].text || "";

    // Strictly ensure history starts with 'user'
    while (history.length > 0 && history[0].role !== "user") {
      history.shift();
    }

    const chatSession = model.startChat({ history });
    const result = await chatSession.sendMessage(prompt);
    const responseText = result.response.text();

    return res.status(200).json({ text: responseText });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}

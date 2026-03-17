import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY || "";
console.log("Found key length:", API_KEY.length);

const genAI = new GoogleGenerativeAI(API_KEY);

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const chat = model.startChat();
    const result = await chat.sendMessageStream("hello");
    for await (const chunk of result.stream) {
      console.log("Chunk:", chunk.text());
    }
    console.log("Done");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Name:", error.name);
      console.error("Message:", error.message);
    }
    console.error("Gemini Error:", error);
  }
}

run();

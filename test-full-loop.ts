import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_PROMPT = `You are an advanced AI Sales Consultant...`; // Truncated for this check but assume full

async function run() {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: "You are a helpful consultant. Be professional."
    });
    const chat = model.startChat();
    const result = await chat.sendMessageStream("Hello, I want to build a website.");
    let text = "";
    for await (const chunk of result.stream) {
      text += chunk.text();
    }
    console.log("Success! Response length:", text.length);
    console.log("Response preview:", text.slice(0, 50));
  } catch (error) {
    console.error("Gemini Error:", error);
  }
}

run();

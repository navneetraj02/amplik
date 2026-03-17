import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBBnNL8yoaBgf0q3LhwrSP0zLLnEz_-Lyw");

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const chat = model.startChat();
    const result = await chat.sendMessage("hello");
    console.log("Success:", result.response.text());
  } catch (error) {
    console.error("Gemini Error:", error);
  }
}

run();

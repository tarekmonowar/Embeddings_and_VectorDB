import "dotenv/config";
import OpenAI from "openai";

/** Ensure the OpenAI API key is available and correctly configured */
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OpenAI API key is missing or invalid.");
}

if (!process.env.AI_URL) {
  throw new Error("OpenAI API base URL is missing or invalid.");
}

const isSupportedHost = /openai\.azure\.com|api\.openai\.com/i.test(
  process.env.AI_URL,
);
if (!isSupportedHost) {
  throw new Error("AI_URL must be an Azure OpenAI or OpenAI endpoint.");
}

/** OpenAI config */
export default new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.AI_URL,
});

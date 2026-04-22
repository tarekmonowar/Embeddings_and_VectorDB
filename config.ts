import "dotenv/config";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

// env check
const requiredEnvVars = [
  "OPENAI_API_KEY",
  "AI_URL",
  "AI_MODEL",
  "SUPABASE_URL",
  "SUPABASE_API_KEY",
];
for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
}

/** OpenAI config */
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.AI_URL,
});

/** Supabase config */
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY,
);

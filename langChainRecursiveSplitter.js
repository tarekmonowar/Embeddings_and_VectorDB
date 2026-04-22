import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { openai, supabase } from "./config.js";
import fs from "fs/promises";

//import long content and use
async function splitDocument(document) {
  try {
    const text = await fs.readFile(document, "utf8");
    if (!text) {
      throw new Error("Document is empty or could not be read.");
    }
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const output = await splitter.createDocuments([text]);
    return output;
  } catch (error) {
    console.error("Error splitting document:", error);
    throw error; // Re-throw the error after logging it
  }
}

async function createAndStoreEmbeddings() {
  try {
    const chunkData = await splitDocument("longContent.txt");
    const data = await Promise.all(
      chunkData.map(async (chunk) => {
        const embeddingResponse = await openai.embeddings.create({
          model: process.env.AI_MODEL,
          input: chunk.pageContent,
          dimensions: 1536,
        });
        return {
          content: chunk.pageContent,
          embedding: embeddingResponse.data[0].embedding,
        };
      }),
    );

    const { error } = await supabase.from("vecto_embedding").insert(data);
    if (error) {
      throw new Error(`Error inserting data: ${error.message}`);
    } else {
      console.log("Embedding and storing complete!", data);
    }
  } catch (error) {
    console.error("Error in createAndStoreEmbeddings:", error.message);
  }
}

createAndStoreEmbeddings();

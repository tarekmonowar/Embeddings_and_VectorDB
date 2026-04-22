import { openai, supabase } from "./config.js";
import { content } from "./content.js";

async function main(input) {
  const data = await Promise.all(
    input.map(async (textChunk) => {
      const embeddingResponse = await openai.embeddings.create({
        model: process.env.AI_MODEL,
        input: textChunk,
        dimensions: 1536, //ai model default embedding size 3072
      });
      return {
        content: textChunk,
        embedding: embeddingResponse.data[0].embedding,
      };
    }),
  );
  const { error } = await supabase.from("vecto_embedding").insert(data);
  if (error) {
    console.error("Error inserting data:", error);
  } else {
    console.log("Embedding and storing complete!", data);
  }
}
main(content);

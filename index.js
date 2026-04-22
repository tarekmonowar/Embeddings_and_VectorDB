import openai from "./config.js";

/** Create embeddings representing the input text */
const content = [
  "Beyond Mars: speculating life on distant planets.",
  "Jazz under stars: a night in New Orleans' music scene.",
  "Mysteries of the deep: exploring uncharted ocean caves.",
  "Rediscovering lost melodies: the rebirth of vinyl culture.",
  "Tales from the tech frontier: decoding AI ethics.",
];

async function main(input) {
  await Promise.all(
    input.map(async (textChunk) => {
      const embeddingResponse = await openai.embeddings.create({
        model: process.env.AI_MODEL,
        input: textChunk,
      });
      const data = {
        content: textChunk,
        embedding: embeddingResponse.data[0].embedding,
      };
      console.log(data);
    }),
  );
  console.log("Embedding complete!");
}
main(content);

// normally result sei embedding vector ar content dey amra ata OpenAi maddome aro human reable korte pari
import { openai, supabase } from "./config.js";
const query = "some podcast episode with high engagement?";

// Create an embedding vector representing the input text
async function createEmbedding(input) {
  const embeddingResponse = await openai.embeddings.create({
    model: process.env.AI_MODEL,
    input,
    dimensions: 1536,
  });
  return embeddingResponse.data[0].embedding;
}

// Query Supabase and return a semantically matching text chunk
async function findNearestMatch(embedding) {
  const { data } = await supabase.rpc("match_documents", {
    query_embedding: embedding,
    match_threshold: 0.1,
    match_count: 4,
  });

  //manage multiple returned match
  const match = data.map((obj) => obj.content).join("\n");
  return match;
}

// Bring all function calls together
async function main(input) {
  try {
    const embedding = await createEmbedding(input);
    const match = await findNearestMatch(embedding);
    // console.log(match);
    await getChatCompletion(match, input);
  } catch (error) {
    console.error("Error in main function.", error);
  }
}

main(query);

//Use OpenAi to make the response conversational and human reable
const chatMessages = [
  {
    role: "system",
    content: `You are an enthusiastic tedtalk  expert who loves recommending episodes to people. You will be given two pieces of information - some context about episodes and a question. Your main job is to formulate a short answer to the question using the provided context. If the answer is not given in the context, find the answer in the conversation history if possible. If you are unsure and cannot find the answer, say, "Sorry, I don't know the answer." Please do not make up the answer. Always speak as if you were chatting to a friend.`,
  },
];

async function getChatCompletion(text, query) {
  chatMessages.push({
    role: "user",
    content: `Context: ${text} Question: ${query}`,
  });

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL,
    messages: chatMessages as any,
    temperature: 0.5,
    frequency_penalty: 0.5,
  });

  chatMessages.push(response.choices[0].message);
  console.log(response.choices[0].message.content);
}

# Embeddings & Vector Database — Learning Project

A hands-on Node.js project exploring **OpenAI Embeddings**, **Vector Databases**, **Supabase pgvector**, **RAG (Retrieval-Augmented Generation)**, and **LangChain Recursive Text Splitting**.

---

## What I Learned

### 1. Embeddings
- Text embeddings convert human-readable text into high-dimensional numerical vectors (arrays of floats).
- These vectors capture the **semantic meaning** of the text, so similar content produces vectors that are close together in vector space.
- Used OpenAI's embedding model with `1536` dimensions to generate vector representations of text chunks.

### 2. Vector Database (Supabase pgvector)
- A **vector database** is purpose-built for storing and querying high-dimensional vectors.
- Used **Supabase** with the **pgvector** PostgreSQL extension to store embeddings alongside their source text.
- Created a `vecto_embedding` table with a `vector(1536)` column to hold embedding data.
- Wrote a custom **RPC function** (`match_documents`) using cosine distance (`<=>`) to perform similarity search and return the most relevant results.

### 3. RAG (Retrieval-Augmented Generation)
- RAG combines **vector similarity search** with **LLM-powered generation** to produce grounded, context-aware answers.
- **How it works in this project:**
  1. The user's query is converted into an embedding vector.
  2. The vector is compared against stored embeddings in Supabase to find the most semantically similar content.
  3. The matched content is passed as **context** to OpenAI's chat completion API.
  4. The LLM generates a conversational, human-readable response based on the retrieved context — not from its own training data.
- This approach reduces hallucination and keeps answers grounded in the actual stored data.

### 4. LangChain Recursive Text Splitter
- Long documents need to be split into smaller, overlapping **chunks** before embedding, because embedding models have input size limits and smaller chunks produce more precise search results.
- Used **`RecursiveCharacterTextSplitter`** from `@langchain/textsplitters` to split a large text file into chunks of **1000 characters** with **200 characters of overlap**.
- The overlap ensures important context at chunk boundaries is not lost.
- Each chunk is then independently embedded and stored in the vector database.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js / TypeScript** | Runtime environment & language |
| **tsx** | TypeScript execution engine (no build step) |
| **OpenAI API** | Generating embeddings & chat completions |
| **Supabase** | Hosted PostgreSQL with pgvector extension |
| **pgvector** | PostgreSQL extension for vector similarity search |
| **LangChain** | Text splitting utilities for chunking documents |
| **dotenv** | Environment variable management |

---

## Project Structure

```
├── config.ts                      # OpenAI & Supabase client configuration
├── content.ts                     # Sample text data (fake podcast descriptions)
├── index.ts                       # Generate embeddings & store in Supabase
├── search.ts                      # Semantic similarity search via vector matching
├── searchResultWithOpenAi.ts      # RAG — search + OpenAI chat completion
├── langChainRecursiveSplitter.ts  # Split long documents into chunks & embed
├── longContent.txt                # Sample long-form content for chunking
├── documents.sql                  # SQL schema for the vector embedding table
├── rpcFunction.sql                # SQL function for cosine similarity search
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies and npm scripts
├── .env                           # Environment variables (not committed)
└── .gitignore                     # Git ignore rules
```

---

## Database Setup

### 1. Create the Embedding Table

```sql
CREATE TABLE vecto_embedding (
  id bigserial PRIMARY KEY,
  content text,
  embedding vector(1536)
);
```

### 2. Create the Similarity Search Function

```sql
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id bigint,
  content text,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    vecto_embedding.id,
    vecto_embedding.content,
    1 - (vecto_embedding.embedding <=> query_embedding) AS similarity
  FROM vecto_embedding
  WHERE 1 - (vecto_embedding.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$$;
```

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- A Supabase project with the **pgvector** extension enabled
- An OpenAI API key

### Installation

```bash
git clone https://github.com/your-username/embedding-vector-db.git
cd embedding-vector-db
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key
AI_URL=your_openai_base_url
AI_MODEL=your_embedding_model
OPENAI_MODEL=your_chat_model
SUPABASE_URL=your_supabase_url
SUPABASE_API_KEY=your_supabase_anon_key
```

---

## Usage

| Command | Description |
|---|---|
| `npm run create` | Generate embeddings from sample content and store them in Supabase |
| `npm run search` | Perform a semantic similarity search against stored embeddings |
| `npm run searchHuman` | RAG — search + generate a human-readable response via OpenAI |
| `npm run langChainSplitter` | Split a long document into chunks, embed, and store them |

---

## Key Concepts Summary

```
Text → Embedding (Vector) → Store in Vector DB
                                    ↓
User Query → Embedding → Similarity Search → Matched Context
                                                    ↓
                                          LLM + Context → Human-Readable Answer (RAG)
```

---

## License

This project is for **learning and educational purposes**.

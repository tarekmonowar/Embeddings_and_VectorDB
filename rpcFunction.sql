-- Create a function to search for documents
create or replace function match_documents (
 query_embedding vector(1536), -- আপনার সার্চ কুয়েরির এমবেডিং
  match_threshold float,        -- কতটুকু মিল থাকতে হবে (যেমন: 0.5)
  match_count int               -- কয়টি রেজাল্ট দেখাবে
)
returns table (
  id bigint,
  content text,
  similarity float
)
language sql stable
as $$
  select
    vecto_embedding.id,
    vecto_embedding.content,
    1 - (vecto_embedding.embedding <=> query_embedding) as similarity  -- ১ থেকে দূরত্ব বিয়োগ করলে মিল পাওয়া যায়
  from vecto_embedding
  where 1 - (vecto_embedding.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;
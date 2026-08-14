-- Create a function to similarity search knowledge chunks
CREATE OR REPLACE FUNCTION match_knowledge_chunks (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  content text,
  policy_name text,
  section text,
  source text,
  similarity float
)
LANGUAGE sql
AS $$
SELECT
  knowledge_chunks.id,
  knowledge_chunks.content,
  knowledge_chunks.policy_name,
  knowledge_chunks.section,
  knowledge_chunks.source,
  1 - (knowledge_chunks.embedding <=> query_embedding) AS similarity
FROM
  knowledge_chunks
WHERE
  1 - (knowledge_chunks.embedding <=> query_embedding) > match_threshold
ORDER BY
  knowledge_chunks.embedding <=> query_embedding
LIMIT match_count;
$$;

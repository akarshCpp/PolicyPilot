-- Create a table to store knowledge chunks and their embeddings
CREATE TABLE IF NOT EXISTS knowledge_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    embedding VECTOR(768), -- BAAI/bge-base-en-v1.5 outputs 768-dimensional vectors
    policy_name TEXT NOT NULL,
    section TEXT NOT NULL,
    source TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create an index to speed up similarity search
-- Using hnsw (Hierarchical Navigable Small World) for efficient vector search
CREATE INDEX ON knowledge_chunks USING hnsw (embedding vector_cosine_ops);

import pytest
from app.rag.chunker import chunk_markdown
from app.rag.embeddings import generate_embedding
import os

def test_chunking():
    # Create a dummy markdown file
    dummy_md = "test_policy.md"
    content = "# Test Policy\n\n## Section 1\nContent 1\n\n## Section 2\nContent 2\n"
    with open(dummy_md, 'w', encoding='utf-8') as f:
        f.write(content)
        
    try:
        chunks = chunk_markdown(dummy_md)
        assert len(chunks) == 2
        assert chunks[0]["section"] == "Section 1"
        assert chunks[0]["content"] == "Content 1"
        assert chunks[1]["section"] == "Section 2"
        assert chunks[1]["content"] == "Content 2"
    finally:
        os.remove(dummy_md)

def test_embeddings():
    embedding = generate_embedding("Hello world")
    assert isinstance(embedding, list)
    assert len(embedding) == 768 # BAAI/bge-base-en-v1.5 vector size

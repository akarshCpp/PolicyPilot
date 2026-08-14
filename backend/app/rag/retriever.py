from supabase import create_client, Client
from app.core.config import settings
from app.rag.embeddings import generate_embedding
import logging

supabase: Client = create_client(settings.supabase_url, settings.supabase_service_role_key)

def retrieve_relevant_chunks(question: str, top_k: int = 5):
    """
    Generates an embedding for the question and retrieves the most similar chunks from Supabase.
    """
    # BGE recommends this prefix for queries
    query_prefix = "Represent this sentence for searching relevant passages: "
    query_text = query_prefix + question
    
    try:
        query_embedding = generate_embedding(query_text)
        
        # We need an RPC function in supabase to do the vector similarity search, 
        # but supabase python client allows raw queries via postgres REST API if we created the rpc, 
        # or we can just use the rpc method.
        # Let's assume we create a match_knowledge_chunks function in Supabase.
        # Wait, the instruction says "simple vector similarity search".
        # Supabase requires an RPC function for pgvector similarity search via the REST API.
        
        response = supabase.rpc(
            'match_knowledge_chunks',
            {'query_embedding': query_embedding, 'match_threshold': 0.2, 'match_count': top_k}
        ).execute()
        
        return response.data
    except Exception as e:
        logging.error(f"Error retrieving chunks: {e}")
        return []

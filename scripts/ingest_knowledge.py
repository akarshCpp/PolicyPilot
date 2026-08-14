import os
import sys
import glob

# Add backend to path so we can import from app
sys.path.append(os.path.join(os.path.dirname(__file__), '../backend'))

from supabase import create_client, Client
from app.core.config import settings
from app.rag.chunker import chunk_markdown
from app.rag.embeddings import generate_embedding

def main():
    supabase: Client = create_client(settings.supabase_url, settings.supabase_service_role_key)
    knowledge_dir = os.path.join(os.path.dirname(__file__), '../knowledge')
    
    markdown_files = glob.glob(f"{knowledge_dir}/*.md")
    if not markdown_files:
        print("No markdown files found in knowledge directory.")
        return

    print(f"Found {len(markdown_files)} markdown files. Starting ingestion...")

    for file_path in markdown_files:
        print(f"Processing {os.path.basename(file_path)}...")
        
        # 1. Chunk document
        chunks = chunk_markdown(file_path)
        
        source = os.path.basename(file_path)
        # Delete existing chunks for this source to avoid duplicates
        try:
            supabase.table('knowledge_chunks').delete().eq('source', source).execute()
        except Exception as e:
            print(f"Error deleting existing chunks for {source}: {e}")

        for chunk in chunks:
            # 2. Generate embedding
            embedding = generate_embedding(chunk["content"])
            
            # 3. Upsert to Supabase
            data = {
                "content": chunk["content"],
                "embedding": embedding,
                "policy_name": chunk["policy_name"],
                "section": chunk["section"],
                "source": chunk["source"]
            }
            
            try:
                supabase.table('knowledge_chunks').insert(data).execute()
            except Exception as e:
                print(f"Error inserting chunk for {chunk['section']}: {e}")
                
        print(f"Finished processing {os.path.basename(file_path)}.")

    print("Knowledge ingestion complete.")

if __name__ == "__main__":
    main()

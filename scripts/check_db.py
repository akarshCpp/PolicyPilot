import os
import sys

# Add backend to path so we can import from app
sys.path.append(os.path.join(os.path.dirname(__file__), '../backend'))

from supabase import create_client, Client
from app.core.config import settings

def main():
    try:
        supabase: Client = create_client(settings.supabase_url, settings.supabase_service_role_key)
        response = supabase.table('knowledge_chunks').select('count', count='exact').execute()
        print(f"Number of chunks in database: {response.count}")
    except Exception as e:
        print(f"Error querying database: {e}")

if __name__ == "__main__":
    main()

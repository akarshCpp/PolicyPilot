# PolicyPilot

PolicyPilot is a simple, production-quality chatbot that allows employees to ask questions about company policies using natural language. It retrieves relevant sections from company policy documents and uses an LLM to generate an answer grounded only in the retrieved information.

## Architecture

![Architecture](https://via.placeholder.com/800x400?text=React+->+FastAPI+->+Supabase/pgvector+->+Groq+LLM)

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: Supabase PostgreSQL with `pgvector`
- **Embeddings**: Local `BAAI/bge-base-en-v1.5` via `sentence-transformers`
- **LLM**: Groq (Llama 3 8B)

## How RAG Works in PolicyPilot
1. **Document Processing**: Markdown policy files are chunked by section (`## ` headers) using `chunker.py`.
2. **Embedding**: Each chunk is embedded using the local `BAAI/bge-base-en-v1.5` model.
3. **Storage**: Chunks and embeddings are stored in Supabase in the `knowledge_chunks` table.
4. **Retrieval**: When a user asks a question, it's embedded, and `pgvector` retrieves the Top-K (5) most similar chunks.
5. **Generation**: The context chunks are passed to the Groq LLM with strict instructions to answer *only* using the provided context.
6. **Citation**: The source (Policy Name, Section) is returned to the frontend.

## Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- Supabase account & project
- Groq API Key

### Backend Setup
1. `cd backend`
2. Create virtual environment: `python -m venv .venv`
3. Activate it: `.venv\Scripts\activate` (Windows)
4. Install dependencies: `pip install -r requirements.txt`

### Database Setup
1. Run the migrations in `supabase/migrations/` on your Supabase project (from the Supabase SQL editor or CLI).
2. Get your `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

### Environment Variables
Copy `.env.example` to `.env` in the root directory and fill in your keys:
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GROQ_API_KEY=your_groq_api_key
```

### Knowledge Ingestion
1. From the root directory, ensure backend `.venv` is activated.
2. Run: `python scripts/ingest_knowledge.py`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`

### Running the App
- Backend: `cd backend` -> `uvicorn app.main:app --reload`
- Frontend: `cd frontend` -> `npm run dev`

## Evaluation
An `evaluation_dataset.json` file is provided with sample questions to evaluate retrieval accuracy and hallucination rates.

## Future Improvements
- Implement BM25 hybrid search for better keyword matching.
- Add user authentication and row-level security.
- Add streaming responses for the LLM.

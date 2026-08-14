# PolicyPilot Architecture Decisions

## Decision: Use Supabase + pgvector

### Decision
We are using Supabase as our PostgreSQL provider and utilizing the `pgvector` extension for vector similarity search.

### Alternatives
- **Pinecone / Qdrant / Weaviate / Milvus:** Dedicated vector databases.
- **Local FAISS:** In-memory local vector index.

### Why
Supabase provides a standard PostgreSQL database, allowing us to store both standard structured data (policy metadata) and embeddings in the same database. This reduces operational complexity by keeping the architecture simple. Dedicated vector databases add unnecessary overhead for a project of this scale.

### Trade-offs
- Advantages: Unified database, standard SQL querying, easy integration with row-level security (if needed in the future).
- Disadvantages: Slightly less optimized for massive-scale vector search compared to specialized databases, but perfectly adequate for <10,000 document chunks.

---

## Decision: Use BAAI/bge-base-en-v1.5 via Sentence-Transformers

### Decision
We will use the `BAAI/bge-base-en-v1.5` model, running locally via the `sentence-transformers` Python package, to generate embeddings.

### Alternatives
- **OpenAI text-embedding-ada-002 / text-embedding-3-small:** Cloud-based API embedding models.
- **Cohere / Voyage AI Embeddings.**

### Why
Using a local model ensures that sensitive company policy data is not sent to an external embedding API provider, improving privacy. `bge-base-en-v1.5` offers excellent retrieval performance for its size and can easily run on standard hardware.

### Trade-offs
- Advantages: Free, private, operates locally without API latency or rate limits.
- Disadvantages: Requires the backend server to have enough CPU/RAM to load and run the model; deployment bundle size is larger.

---

## Decision: Section-based Chunking

### Decision
We will split Markdown documents into chunks based on semantic sections (headers) rather than arbitrary character counts or fixed sliding windows.

### Alternatives
- **Fixed-size sliding windows:** (e.g., 500 tokens with 50-token overlap).
- **Semantic chunking:** Using LLMs to determine chunk boundaries.

### Why
Company policies are inherently structured by sections (e.g., "Casual Leave", "Eligibility"). Chunking by these sections preserves context and allows us to provide a more accurate and readable citation (e.g., "Leave Policy -> Casual Leave").

### Trade-offs
- Advantages: highly contextual chunks, better citations, easy to debug.
- Disadvantages: Sections can sometimes be very long or very short, leading to variable chunk sizes.

---

## Decision: Simple Vector Search (Top-K)

### Decision
Retrieval will use simple cosine similarity search via pgvector to fetch the top 5 most similar chunks.

### Alternatives
- **Hybrid Search (Vector + BM25).**
- **Query Expansion / HyDE.**
- **Reranking models (e.g., Cohere Rerank / BGE Reranker).**

### Why
The goal is to keep the architecture understandable and maintainable. Advanced RAG techniques are often overkill unless simple vector search proves insufficient during evaluation. We will start with a simple baseline.

### Trade-offs
- Advantages: Simple implementation, fast, easy to reason about.
- Disadvantages: May struggle with keyword-heavy queries where BM25 would excel, or complex multi-hop reasoning.

---

## Decision: Use Groq

### Decision
We are using Groq for the LLM inference provider.

### Alternatives
- **OpenAI / Anthropic APIs.**
- **Local LLMs (e.g., Llama 3 via Ollama).**

### Why
Groq provides ultra-low latency inference for open-weight models (like Llama 3 or Mixtral). This will make the chatbot feel highly responsive while keeping the architecture modular (the provider can easily be swapped).

### Trade-offs
- Advantages: Blazing fast response times.
- Disadvantages: Relies on an external API (unlike embeddings which are local).

---

## Decision: React, Vite, and Tailwind CSS for Frontend

### Decision
The frontend will be built as a Single Page Application (SPA) using React, bundled with Vite, and styled with Tailwind CSS.

### Alternatives
- **Next.js:** Full-stack React framework.
- **Vanilla HTML/JS or Streamlit:** Simpler UI alternatives.

### Why
React + Vite provides a fast, robust foundation for a professional chat interface without the unnecessary backend complexity of Next.js (since we are using FastAPI). Tailwind allows for rapid, visually appealing UI development without managing large CSS files.

### Trade-offs
- Advantages: Fast development, highly customizable, standard modern stack.
- Disadvantages: Requires setting up API calls to the separate FastAPI backend.

---

## Decision: FastAPI for Backend

### Decision
We will use FastAPI (Python) for the backend service.

### Alternatives
- **Flask / Django:** Other Python frameworks.
- **Express.js / Node.js:** Javascript backend.

### Why
FastAPI is modern, extremely fast, natively supports asynchronous programming, and provides built-in data validation via Pydantic. Python is also the standard language for AI/ML and RAG workloads, making integration with `sentence-transformers` seamless.

### Trade-offs
- Advantages: Built-in Swagger UI, typed validation, fast performance, Python ecosystem integration.
- Disadvantages: Slightly steeper learning curve than simple Flask for beginners due to async concepts, but manageable.

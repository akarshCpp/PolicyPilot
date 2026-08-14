from fastapi import APIRouter, HTTPException
from app.models import ChatRequest, ChatResponse, Source
from app.rag.retriever import retrieve_relevant_chunks
from app.llm.client import generate_answer
from app.llm.prompts import construct_rag_prompt

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
    
    # 1. Retrieve chunks
    chunks = retrieve_relevant_chunks(request.question, top_k=5)
    
    if not chunks:
        # No documents retrieved or error in connection
        return ChatResponse(
            answer="I couldn't find this information in the available company policies.",
            sources=[]
        )
    
    # 2. Construct prompt
    prompt = construct_rag_prompt(request.question, chunks, request.conversation_history)
    
    # 3. Generate answer
    answer = generate_answer(prompt)
    
    # 4. Format sources
    sources = []
    for chunk in chunks:
        sources.append(
            Source(
                policy=chunk.get("policy_name", "Unknown Policy"),
                section=chunk.get("section", "Unknown Section"),
                content=chunk.get("content", "")
            )
        )
        
    return ChatResponse(answer=answer, sources=sources)

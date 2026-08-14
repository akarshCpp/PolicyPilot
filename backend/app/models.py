from pydantic import BaseModel
from typing import List

class ChatRequest(BaseModel):
    question: str
    conversation_history: List[dict] = [] # e.g. [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]

class Source(BaseModel):
    policy: str
    section: str
    content: str

class ChatResponse(BaseModel):
    answer: str
    sources: List[Source]

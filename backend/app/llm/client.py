from groq import Groq
from app.core.config import settings
import logging

client = Groq(api_key=settings.groq_api_key)

def generate_answer(prompt: str) -> str:
    """
    Sends the prompt to Groq API and returns the generated text.
    Uses llama3-8b-8192 for fast, capable RAG generation.
    """
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.1-8b-instant",
            temperature=0.0,
            max_tokens=1024,
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        logging.error(f"Error calling Groq API: {e}")
        return "Sorry, I encountered an error while generating the answer."

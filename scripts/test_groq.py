import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), '../backend'))

from app.llm.client import generate_answer
from groq import Groq
from app.core.config import settings

def main():
    print(f"Testing Groq client...")
    try:
        client = Groq(api_key=settings.groq_api_key)
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": "Hello",
                }
            ],
            model="llama3-8b-8192",
            temperature=0.0,
            max_tokens=10,
        )
        print("Success:", chat_completion.choices[0].message.content)
    except Exception as e:
        print("Exception caught:", e)

if __name__ == "__main__":
    main()

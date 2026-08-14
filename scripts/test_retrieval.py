import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), '../backend'))

from app.rag.retriever import retrieve_relevant_chunks

def main():
    question = "How many casual leaves can I take?"
    chunks = retrieve_relevant_chunks(question, top_k=5)
    
    print(f"Retrieved {len(chunks)} chunks for question: {question}")
    for i, c in enumerate(chunks):
        print(f"[{i+1}] {c.get('policy_name')} - {c.get('section')}")
        print(f"Similarity: {c.get('similarity', 'N/A')}")
        
if __name__ == "__main__":
    main()

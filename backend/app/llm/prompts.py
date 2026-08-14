def construct_rag_prompt(question: str, context_chunks: list[dict], conversation_history: list[dict] = []) -> str:
    """
    Constructs the prompt for the LLM based on retrieved context and user question.
    """
    context_str = "\n\n".join(
        [f"--- Policy: {chunk['policy_name']} | Section: {chunk['section']} ---\n{chunk['content']}" 
         for chunk in context_chunks]
    )

    history_str = ""
    if conversation_history:
        history_str = "Conversation History:\n"
        for msg in conversation_history:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            history_str += f"{role.capitalize()}: {content}\n"
        history_str += "\n"

    prompt = f"""You are PolicyPilot, a helpful internal company assistant. Your job is to answer employee questions about company policies using ONLY the provided policy context below.

Instructions:
1. Answer using ONLY the retrieved policy context.
2. Do not invent company policies or hallucinate.
3. Do not use general world knowledge when answering company-policy questions.
4. If the answer is not present in the retrieved context, clearly state: "I couldn't find this information in the available company policies."
5. Keep your answer clear, concise, and professional.

Context Information:
{context_str}

{history_str}User Question: {question}

Answer:"""
    return prompt

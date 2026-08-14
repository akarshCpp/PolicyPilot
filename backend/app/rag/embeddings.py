from sentence_transformers import SentenceTransformer

# Load the local model
model = SentenceTransformer('BAAI/bge-base-en-v1.5')

def generate_embedding(text: str) -> list[float]:
    """
    Generates an embedding vector for the given text using the local bge-base-en-v1.5 model.
    """
    # The bge model recommends adding this prefix for query retrieval if generating query embeddings,
    # but for simple chunk embeddings we just encode. 
    # For simplicity, we just encode the text as is for both document and query.
    # To strictly follow BGE guidelines, you can optionally prepend "Represent this sentence for searching relevant passages: " 
    # for the query. Here we keep it simple.
    embedding = model.encode(text, normalize_embeddings=True)
    return embedding.tolist()

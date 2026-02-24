import sys, json
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("BAAI/bge-small-en-v1.5")

def embed(texts):
    # ensure list of non-empty strings
    clean = []
    for t in texts:
        if isinstance(t, dict):
            content = t.get("pageContent") or t.get("text") or ""
        else:
            content = str(t)
        
        # Only add non-empty strings
        if content and content.strip():
            clean.append(content.strip())
    
    # Handle case where no valid texts remain
    if not clean:
        return []
    
    try:
        # Try encoding one by one to isolate the issue
        embeddings = []
        for text in clean:
            embedding = model.encode([text], normalize_embeddings=True)
            # Convert numpy array to Python list
            embeddings.append(embedding[0].tolist())
        
        return embeddings
    except Exception as e:
        # Fallback: try with single text if batch fails
        if clean:
            embedding = model.encode(clean[0], normalize_embeddings=True)
            return embedding.tolist()
        return []

if __name__ == "__main__":
    try:
        input_data = sys.stdin.read()
        texts = json.loads(input_data)
        vectors = embed(texts)
        print(json.dumps(vectors))
    except Exception as e:
        print(json.dumps([]))
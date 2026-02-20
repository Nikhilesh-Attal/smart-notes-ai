import sys
import json
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("BAAI/bge-small-en-v1.5")

def embed(texts):
    embeddings = model.encode(texts, normalize_embeddings=True)
    return embeddings.tolist()

if __name__ == "__main__":
    input_json = sys.stdin.read()
    texts = json.loads(input_json)
    vectors = embed(texts)
    print(json.dumps(vectors))
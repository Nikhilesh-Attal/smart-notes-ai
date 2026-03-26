import sys
import json
import os
import io

# 1. FORCE UTF-8 FOR WINDOWS (Fixes the ENCODE_ERROR)
sys.stdin = io.TextIOWrapper(sys.stdin.buffer, encoding='utf-8')
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# 2. FORCE OFFLINE MODE (Stops requests to Hugging Face)
os.environ["TRANSFORMERS_OFFLINE"] = "1"
os.environ["HF_HUB_OFFLINE"] = "1"
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
os.environ["TRANSFORMERS_VERBOSITY"] = "error"

from sentence_transformers import SentenceTransformer

# 3. LOAD MODEL (Device 'cpu' is safest for local testing)
try:
    model = SentenceTransformer('all-MiniLM-L6-v2', device='cpu')
except Exception as e:
    sys.stderr.write(f"MODEL_LOAD_ERROR: {str(e)}")
    sys.exit(1)

def main():
    try:
        input_data = sys.stdin.read().strip()
        if not input_data:
            return

        raw_payload = json.loads(input_data)
        
        # 4. STRICT STRING CLEANING
        processed_texts = []
        # Handle if Node sends a single string or a list
        items = raw_payload if isinstance(raw_payload, list) else [raw_payload]

        for item in items:
            if item is None:
                continue
            # If it's a dict (from LangChain), get content. Otherwise, force to string.
            if isinstance(item, dict):
                val = item.get("pageContent") or item.get("text") or str(item)
            else:
                val = str(item)
            
            processed_texts.append(val)

        if not processed_texts:
            return

        # 5. GENERATE EMBEDDINGS (No progress bar to keep stdout clean)
        embeddings = model.encode(processed_texts, show_progress_bar=False)
        
        # 6. OUTPUT ONLY THE JSON
        print(json.dumps(embeddings.tolist()))
        sys.stdout.flush()
        
    except Exception as e:
        sys.stderr.write(f"ENCODE_ERROR: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
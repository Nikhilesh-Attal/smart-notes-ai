from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from llama_cpp import Llama
import uvicorn

app = FastAPI()

# Load Llama 3.2 3B into memory (Global)
print("Loading Llama 3.2...")
llm = Llama(
    model_path="./models/Llama-3.2-3B-Instruct-Q4_K_M.gguf",
    n_ctx=2048, 
    n_threads=4 # Adjust based on your CPU
)

class QueryRequest(BaseModel):
    prompt: str
    context: str

@app.post("/generate")
async def generate(request: QueryRequest):
    # Llama 3.2 Prompt Template
    full_prompt = f"<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\nUse the following context to answer the user's question accurately.<|eot_id|><|start_header_id|>user<|end_header_id|>\n\nContext: {request.context}\n\nQuestion: {request.prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n"
    
    output = llm(full_prompt, max_tokens=512, stop=["<|eot_id|>"])
    return {"answer": output["choices"][0]["text"].strip()}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
from llama_cpp import Llama

# Initialize model
# This will load the model into the 16GB RAM provided by Hugging Face
llm = Llama(
    model_path="./models/llama-3.2-3b-instruct.Q4_K_M.gguf",
    n_ctx=2048, # Context window
)

def generate_answer(prompt, context):
    full_prompt = f"Context: {context}\n\nQuestion: {prompt}\n\nAnswer:"
    output = llm(full_prompt, max_tokens=512)
    return output["choices"][0]["text"]
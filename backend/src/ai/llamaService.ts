import axios from 'axios';

// Ollama runs on port 11434 by default
const OLLAMA_API_URL = "http://127.0.0.1:11434/api/generate"; 

export async function answerWithLlama(question: string, context: string) {
    try {
        console.log("[Ollama] Sending request to Llama 3.2...");

        const response = await axios.post(OLLAMA_API_URL, {
            model: "llama3.2:3b",
            prompt: `Instructions: Answer the question based ONLY on the provided context.
            
Context: ${context}

Question: ${question}

Answer:`,
            stream: false // Set to false to get the full answer in one go
        });

        return response.data.response.trim();
    } catch (error: any) {
        console.error("[Ollama Error]:", error.message);
        return "I'm sorry, I couldn't connect to my AI brain (Ollama). Please make sure Ollama is running.";
    }
}
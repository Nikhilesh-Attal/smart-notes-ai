import { pipeline, env } from "@xenova/transformers";

// 1. Fix the TS Error: Bypass the type check to silence logs
// This stops the 'Removing initializer' warnings without crashing the build
(env as any).logLevel = 'error';

let qaPipeline: any = null;

/**
 * Singleton model loader
 */
async function getQAModel() {
  if (!qaPipeline) {
    console.log("[FLAN-T5] Loading local model into RAM (approx. 250MB)...");
    qaPipeline = await pipeline(
      "text2text-generation",
      "Xenova/flan-t5-base"
    );
    console.log("[FLAN-T5] Model ready.");
  }
  return qaPipeline;
}

/**
 * Ensures the context doesn't exceed the model's token capacity
 */
function truncateContext(context: string, maxChars = 3000) {
  if (context.length <= maxChars) return context;
  return context.slice(0, maxChars) + "... [truncated]";
}

/**
 * Main Answer Generation Function
 */
export async function answerFromContext(question: string, context: string) {
  try {
    const model = await getQAModel();
    
    // Clean and truncate context
    const cleanContext = truncateContext(context);
    
    // Simple, direct prompt for FLAN-T5
    const prompt = `Answer the following question using only the context.
Context: ${cleanContext}
Question: ${question}
Answer:`;

    const result = await model(prompt, {
      max_new_tokens: 150, 
      temperature: 0.1,    // Keep it factual
      repetition_penalty: 1.2
    });

    return result[0].generated_text.trim();
  } catch (error: any) {
    console.error("[FLAN-T5 Error]:", error.message);
    throw new Error("Local AI failed to generate an answer.");
  }
}
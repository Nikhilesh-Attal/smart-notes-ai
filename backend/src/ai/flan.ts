import { pipeline, env } from "@xenova/transformers";
import { parse } from "node:path";

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
function truncateContext(context: string, maxChars = 2000) {
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
    const cleanContext = truncateContext(context, 2000);
    
    //dynaminc word count detection
    const wordMatch = question.match(/(\d+)\s*words?/i);
    let wordConstraint = "";
    let maxTokens = 512; //default high limit

    if(wordMatch && wordMatch[1]){
      const requestedWords = parseInt(wordMatch[1], 10);
      wordConstraint = `\nCritical instruction: Answer in exactly ${requestedWords} words.`;
      
      //adjust tokens dynamically (roughtly 1.5 tokens per word + buffer)
      maxTokens = Math.min(Math.floor(requestedWords * 1.5) + 50, 1024);
    }
    
    // Improved prompt for better academic content handling
    const prompt = `Answer the question based ONLY on the following context. If you cannot find the answer, say "I cannot answer this."${wordConstraint}
    
    Question: ${question}
    
    Context: ${cleanContext}

Answer:`;

    const result = await model(prompt, {
      max_new_tokens: maxTokens, 
      temperature: 0.3,    // Bumped up slightly so it can generate better summaries instead of just extracting
      repetition_penalty: 1.2,
      do_sample: true,    // Required for temperature to actually affect the output
    });

    return result[0].generated_text.trim();
  } catch (error: any) {
    console.error("[FLAN-T5 Error]:", error.message);
    throw new Error("Local AI failed to generate an answer.");
  }
}
import { pipeline, env } from "@xenova/transformers";

//silence the TS initialization warnings
(env as any).logLevel = 'error';

let rewritePipeline: any = null;

async function getRewriteModel() {
  if (!rewritePipeline) {
    rewritePipeline = await pipeline(
      "text2text-generation",
      "Xenova/flan-t5-base"
    );
  }
  return rewritePipeline;
}

function buildRewritePrompt(history: any[], question: string) {
  const recent = history
    .slice(0, 2)
    .reverse()
    .map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

 // We give FLAN-T5 an exact example of what we want so it understands the pattern.
  return `Rewrite the final question to make it clear and standalone using context from the history. Do not answer the question.

    History: ${recent}

    Question: ${question}

    Rewritten question:
`.trim();
}

export async function rewriteQuestionWithHistory(
  history: any[],
  question: string
): Promise<string> {
  if (!history || history.length <= 1) {
    return question;
  }

  try{
    const model = await getRewriteModel();
  
    const prompt = buildRewritePrompt(history, question);
  
    const result = await model(prompt, {
      max_new_tokens: 64,
      temperature: 0.1,
    });
  
    const rewritten = result[0].generated_text.trim();
  
    // FAIL-SAFE: If the model hallucinates and outputs something totally unrelated,
    // or spits out instructions, fallback to the original question.
    if (!rewritten || rewritten.length < 3 || rewritten.includes("Rewrite the final question")) {
        console.warn("[rewriteQuestion] Model hallucinated. Falling back to original query.");
        return question;
    }

    return rewritten;
  }catch(error){
    console.error("[rewriteQuestion]Error rewriting question:", error);
    return question;
  }
}
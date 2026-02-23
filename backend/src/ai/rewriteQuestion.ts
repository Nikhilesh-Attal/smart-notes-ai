// backend/src/ai/rewriteQuestion.ts

import { pipeline } from "@xenova/transformers";

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
    .slice(0, 6)
    .reverse()
    .map(m => `${m.role}: ${m.content}`)
    .join("\n");

  return `
You are a helpful assistant that rewrites user questions to be standalone questions based on conversation history.
Given the following conversation history and the current question, rewrite the current question to be a complete, standalone question that doesn't depend on the conversation context.

Conversation:
${recent}

Question:
${question}

Rewritten question:
`.trim();
}

export async function rewriteQuestionWithHistory(
  history: any[],
  question: string
): Promise<string> {
  if (!history || history.length === 0) {
    return question;
  }

  const model = await getRewriteModel();

  const prompt = buildRewritePrompt(history, question);

  const result = await model(prompt, {
    max_new_tokens: 64,
    temperature: 0,
  });

  const rewritten = result[0].generated_text.trim();

  return rewritten || question;
}
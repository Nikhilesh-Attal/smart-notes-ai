{/*in this file we define code related to ai
  give prompt to ai how to answer from document as by user. */}
  
import { pipeline } from "@xenova/transformers";

let qaPipeline: any = null;

async function getQAModel() {
  if (!qaPipeline) {
    qaPipeline = await pipeline(
      "text2text-generation",
      "Xenova/flan-t5-base"
    );
  }
  return qaPipeline;
}

function buildPrompt(question: string, context: string) {
  return `
You are a helpful assistant answering questions from documents.

Use ONLY the provided context to answer.
If the answer is not contained in the context, reply:
"Answer is not mentioned in the document."

Context:
${context}

Question:
${question}

Answer:
`.trim();
}

function truncateContext(context: string, maxChars = 4000) {
  if (context.length <= maxChars) return context;
  return context.slice(0, maxChars);
}

export async function answerFromContext(
  question: string,
  context: string
) {
  const model = await getQAModel();

  const safeContext = truncateContext(context);

  const prompt = buildPrompt(question, safeContext);

  const result = await model(prompt, {
    max_new_tokens: 200,
    temperature: 0.2,
  });

  return result[0].generated_text.trim();
}
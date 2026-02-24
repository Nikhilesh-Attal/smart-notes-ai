import { pipeline } from '@xenova/transformers';

let qaPipeline: any = null;

export async function getQAModel() {
  if (!qaPipeline) {
    qaPipeline = await pipeline(
      'text2text-generation',
      'Xenova/flan-t5-base'
    );
  }
  return qaPipeline;
}

export async function answerFromContext(
  question: string,
  context: string
) {
  const model = await getQAModel();

  const prompt = `
Answer the question using only the context below.
If the answer is not in the context, say "I don't know".

Context:
${context}

Question:
${question}
`;

  const result = await model(prompt, {
    max_new_tokens: 200,
  });

  return result[0].generated_text.trim();
}
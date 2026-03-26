import { Embeddings, EmbeddingsParams } from "@langchain/core/embeddings";
import { embedTexts } from "../utils/localEmbeddings";

export class LocalBgeEmbeddings extends Embeddings {
  constructor(params?: EmbeddingsParams) {
    super(params ?? {});
  }

  // This is what LangChain calls internally
  async embedDocuments(documents: any[]): Promise<number[][]> {
    // FIX: LangChain might pass Document objects or plain strings.
    // We must ensure only strings are sent to the Python script.
    const texts = documents.map((doc) => {
    // If it's a LangChain Document object
    if (typeof doc === 'object' && doc !== null && 'pageContent' in doc) {
      return String(doc.pageContent);
    }
    // If it's already a string
    if (typeof doc === 'string') {
      return doc;
    }
    // Final fallback
    return String(doc);
  });

  return await embedTexts(texts);
}

  async embedQuery(text: string): Promise<number[]> {
    const embeddings = await embedTexts([text]);
    return embeddings[0];
  }
}
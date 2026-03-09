import pdfParse from "pdf-parse";
import { chunkText } from "../utils/chunkText";
import { LocalBgeEmbeddings } from "../vector/localBgeEmbeddinds";
import { storeDocumentChunks } from "../vector/supabaseVectorStore";

export const uploadDocumentService = async (file: Express.Multer.File) => {

  const pdfData = await (pdfParse as any)(file.buffer);
  const text = pdfData.text;

  if (!text || text.length < 20) {
    throw new Error("Could not extract text from PDF");
  }

  const chunks = chunkText(text);

  const embeddingsModel = new LocalBgeEmbeddings();
  const embeddings = await embeddingsModel.embedDocuments(chunks);

  await storeDocumentChunks(chunks, embeddings);

  return {
    chunks: chunks.length
  };
};
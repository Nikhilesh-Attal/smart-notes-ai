import { ingestDocument } from "./ingestionService";
import { Request } from "express";

export const uploadDocumentService = async (req: Request, file: Express.Multer.File) => {
  const { documentId } = req.body;

  // 1. EXTRACT THE TOKEN
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error("Unauthorized: Missing token");
  }
  const token = authHeader.split(' ')[1];

  console.log("[uploadDocumentService] Routing file to ingestion service...");

  // 2. PASS FILE, ID, AND TOKEN TO INGESTION SERVICE
  const result = await ingestDocument(file, documentId, token);

  if (!result.ok) {
    throw new Error(result.reason || "Failed to process PDF");
  }

  return {
    chunks: result.chunksProcessed
  };
};
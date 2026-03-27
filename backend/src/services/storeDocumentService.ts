import { ingestYoutube } from "./ingestionService";
import { Request } from "express";

export async function storeDocument(req: Request) {
  const { url, documentId } = req.body;

  // 1. EXTRACT THE TOKEN
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { 
      ok: false, 
      message: "Unauthorized: Missing token" 
    };
  }
  const token = authHeader.split(' ')[1];

  console.log("[storeDocumentService] Processing request:", { url, documentId });
  
  // 2. PASS THE TOKEN TO INGESTION SERVICE
  const result = await ingestYoutube(url, documentId, token);

  if (!result.ok) {
    console.log("[storeDocumentService] Error:", result.error || result.reason || "Unknown Error");
    return {
      ok: false,
      message: result.error || result.reason || "Unknown Error",
    };
  }

  console.log("[storeDocumentService] Success: Document stored");
  return { 
    ok: true,
    message: "Document stored successfully"
  };
}
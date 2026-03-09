import { ingestYoutube } from "./ingestionService";
import { Request } from "express";

export async function storeDocument(req: Request) {
  const { url, documentId } = req.body;

  console.log("[storeDocumentService] Processing request:", { url, documentId });
  
  const result = await ingestYoutube(url, documentId);

  if (!result.ok) {
    console.log("[storeDocumentService] Error:", result.error || result.reason || "Unknown Error");
    return {
      ok: false,
      message: result.error || result.reason || "Unknown Error",
    };
  }

  console.log("[storeDocumentService] Success: Document stored");
  return { ok: true };
}

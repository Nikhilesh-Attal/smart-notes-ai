import { ingestYoutube } from "./ingestionService";
import { Request } from "express";

export async function storeDocument(req: Request) {
  const { url, documentId } = req.body;

  console.log("[storeDocumentService] Request:", { url, documentId });

  await ingestYoutube(url, documentId);

  console.log("[storeDocumentService] Success");
  return { ok: true };
}
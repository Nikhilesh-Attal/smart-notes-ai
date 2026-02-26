import { ingestYoutube } from "./ingestionService";
import { Request } from "express";

export async function storeDocument(req: Request) {
  const { url, documentId } = req.body;

<<<<<<< HEAD
  console.log("[storeDocumentService] Request:", { url, documentId });

  await ingestYoutube(url, documentId);

  console.log("[storeDocumentService] Success");
  return { ok: true };
}
=======
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
>>>>>>> 93fe1ef398e2d753a267bb1a0b001e4b4daf0f27

import { ingestYoutube } from "./ingestionService";
import { Request } from "express";

export async function storeDocument(req: Request) {
  const { url, documentId } = req.body;

  const result = await ingestYoutube(url, documentId);

  console.log("storeDocument called: ",req.body)
  if (!result.ok && result.reason === "NO_TRANSCRIPT") {
    console.log("Video has no captions")
    return {
      ok: false,
      message: "Video has no captions",
    };
  }

  if (!result.ok) {
    return { ok: false };
  }

  return { ok: true };
}

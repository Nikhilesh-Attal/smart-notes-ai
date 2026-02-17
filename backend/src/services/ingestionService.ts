{/*Responsibility:
1. call loader
2. split
3. attach metadata
4. store vectors
5. return result */}

import { youtubeLoader } from "../loaders/youtubeLoader";
import { splitter } from "../config/splitter";
import { vectorStore } from "../vector/supabaseVectorStore";

export async function ingestYoutube(url: string, documentId: string) {
  try {
    const docs = await youtubeLoader(url);

    const chunks = await splitter.splitDocuments(docs);

    const docsWithMeta = chunks.map((c) => ({
      ...c,
      metadata: {
        ...c.metadata,
        documentId,
      },
    }));

    await vectorStore.addDocuments(docsWithMeta);

    return { ok: true };
  } catch (err: any) {
    if (err.message === "YOUTUBE_NO_TRANSCRIPT") {
      return {
        ok: false,
        reason: "NO_TRANSCRIPT",
      };
    }

    return {
      ok: false,
      reason: "UNKNOWN",
    };
  }
}

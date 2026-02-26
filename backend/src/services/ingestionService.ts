<<<<<<< HEAD
=======
{/*Responsibility:
1. call loader
2. split
3. attach metadata
4. store vectors
5. return result */}

>>>>>>> 93fe1ef398e2d753a267bb1a0b001e4b4daf0f27
import { youtubeLoader } from "../loaders/youtubeLoader";
import { splitter } from "../config/splitter";
import { vectorStore } from "../vector/supabaseVectorStore";

export async function ingestYoutube(url: string, documentId: string) {
<<<<<<< HEAD
  if (!url || typeof url !== "string" || !url.trim()) {
    throw new Error("Invalid URL");
  }

  if (!documentId || typeof documentId !== "string" || !documentId.trim()) {
    throw new Error("Invalid documentId");
  }

  try {
    console.log("[ingestionService] Loading transcript...");
    const docs = await youtubeLoader(url);

    console.log("[ingestionService] Splitting transcript...");
    const chunks = await splitter.splitDocuments(docs);
    console.log("[ingestionService] Chunks:", chunks.length);

    console.log("[ingestionService] Attaching metadata...");
    const docsWithMeta = chunks
      .filter(d => d && typeof d.pageContent === "string" && d.pageContent.trim().length > 0)
      .map(doc => ({
        ...doc,
        metadata: {
          ...doc.metadata,
          documentId: documentId,
        },
      }));

    if (docsWithMeta.length === 0) {
      console.warn("[ingestionService] No valid chunks");
      return { ok: true };
    }

    console.log("[ingestionService] Embedding + storing...");
    try {
      await vectorStore.addDocuments(docsWithMeta);
      console.log("[ingestionService] Successfully stored documents in vector store");
    } catch (vectorError) {
      console.error("[ingestionService] Vector store error:", vectorError);
      
      // Try to get more details about the error
      if (vectorError instanceof Error) {
        console.error("[ingestionService] Error message:", vectorError.message);
        console.error("[ingestionService] Error stack:", vectorError.stack);
      }
      
      throw vectorError;
    }

    console.log("[ingestionService] Success");
    return { ok: true };

  } catch (err) {
    console.error("[ingestionService] Error:", err);
    throw err;
  }
}
=======
  try {
    const docs = await youtubeLoader(url);

    const chunks = await splitter.splitDocuments(docs);

    const docsWithMeta = chunks.map((c: any) => ({
      ...c,
      metadata: {
        ...c.metadata,
        documentId,
      },
    }));

    await vectorStore.addDocuments(docsWithMeta);

    return { ok: true };
  } catch (err: any) {
    console.error("[ingestionService] Error during YouTube ingestion:", err.message);
    
    // Pass through the actual error message
    return {
      ok: false,
      reason: err.message || "UNKNOWN_ERROR",
      error: err.message
    };
  }
}
>>>>>>> 93fe1ef398e2d753a267bb1a0b001e4b4daf0f27

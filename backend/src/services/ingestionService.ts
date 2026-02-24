import { youtubeLoader } from "../loaders/youtubeLoader";
import { splitter } from "../config/splitter";
import { vectorStore } from "../vector/supabaseVectorStore";

export async function ingestYoutube(url: string, documentId: string) {
  // Input validation
  if (!url || typeof url !== "string" || !url.trim()) {
    throw new Error("Invalid URL: URL must be a non-empty string");
  }
  
  if (!documentId || typeof documentId !== "string" || !documentId.trim()) {
    throw new Error("Invalid documentId: documentId must be a non-empty string");
  }

  try {
    console.log("[ingestionService] Loading transcript...");
    const docs = await youtubeLoader(url);

    console.log("[ingestionService] Splitting transcript...");
    const chunks = await splitter.splitDocuments(docs);
    console.log("[ingestionService] Chunks:", chunks.length);

    console.log("[ingestionService] Attaching metadata...");
    const docsWithMeta = chunks
      .filter(d => d.pageContent && d.pageContent.trim().length > 0)
      .map(doc => {
        doc.metadata = {
          ...doc.metadata,
          document_id: documentId,
        };
        return doc;
      });

    // Filter out any remaining invalid chunks
    const validDocs = docsWithMeta.filter(d => 
      d.pageContent && typeof d.pageContent === "string"
    );

    // Log any chunks that were filtered out
    const invalidCount = docsWithMeta.length - validDocs.length;
    if (invalidCount > 0) {
      console.log(`[ingestionService] Filtered out ${invalidCount} invalid chunks`);
    }

    // Check if we have valid documents to process
    if (validDocs.length === 0) {
      console.warn("[ingestionService] No valid chunks to process");
      return { ok: true, message: "No valid content to process" };
    }

    console.log("[ingestionService] Embedding + storing...");
    await vectorStore.addDocuments(validDocs);

    console.log("[ingestionService] Success");
    return { ok: true };

  } catch (err) {
    console.error(
      "[ingestionService] Error:",
      err instanceof Error ? err.message : err
    );
    throw err;
  }
}
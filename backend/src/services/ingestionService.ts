/*Responsibility:
1. call loader
2. split
3. attach metadata
4. store vectors
5. return result */

import { youtubeLoader } from "../loaders/youtubeLoader";
import { documentLoader } from "../loaders/documentLoader";
import { splitter } from "../config/splitter";
import { vectorStore } from "../vector/supabaseVectorStore";

// Import Express types for Multer.File
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

export async function ingestYoutube(url: string, documentId: string) {
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
    
    // Pass through actual error message
    return {
      ok: false,
      reason: err.message || "UNKNOWN_ERROR",
      error: err.message
    };
  }
}

export async function ingestDocument(file: MulterFile, documentId: string) {
  try {
    console.log("[ingestionService] Processing file upload for documentId:", documentId);

    // 1. Load and parse the document
    const docs = await documentLoader(file.buffer, file.originalname);
    console.log(`[ingestionService] Successfully loaded ${docs.length} document(s) from ${file.originalname}`);

    // 2. Split documents into chunks
    const chunks = await splitter.splitDocuments(docs);
    console.log(`[ingestionService] Split into ${chunks.length} chunks`);

    // 3. Attach metadata to each chunk
    const docsWithMeta = chunks.map((chunk: any) => ({
      ...chunk,
      metadata: {
        ...chunk.metadata,
        documentId,
        filename: file.originalname,
        uploadedAt: new Date().toISOString(),
      },
    }));

    // 4. Store vectors in Supabase
    await vectorStore.addDocuments(docsWithMeta);
    console.log(`[ingestionService] Successfully stored ${docsWithMeta.length} chunks in vector store`);

    return { 
      ok: true,
      message: `Successfully processed ${file.originalname}`,
      chunksProcessed: docsWithMeta.length
    };
  } catch (err: any) {
    console.error("[ingestionService] Error during document ingestion:", err.message);

    return {
      ok: false,
      reason: err.message || "UNKNOWN_ERROR",
      error: err.message
    };
  }
}

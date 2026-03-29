/* Responsibility:
1. call loader
2. split
3. attach metadata
4. store vectors
5. return result
*/

import { youtubeLoader } from "../loaders/youtubeLoader";
import { documentLoader } from "../loaders/documentLoader";
import { splitter } from "../config/splitter";
import { createSupabaseClient } from "../helpers/supabseClientHelpers";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { LocalBgeEmbeddings } from "../vector/localBgeEmbeddinds";
import fs from "fs";

// Multer file type
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}

export async function ingestYoutube(url: string, documentId: string, token: string) {
  try {

    //initialize secure user client
    const supabase = createSupabaseClient(token);
    const { data: {user}, error: authError } = await supabase.auth.getUser();
    if(authError || !user) throw new Error("[ingestionService] unauthorized: invalid token");
    const userId = user.id;

    // 1. Load youtube transcript
    const docs = await youtubeLoader(url);

    // 2. Split into chunks
    const chunks = await splitter.splitDocuments(docs);

    // 3. Attach metadata
    const docsWithMeta = chunks.map((c: any) => ({
      pageContent: c.pageContent,
      metadata: {
        ...c.metadata,
        documentId,
        userId,
      },
    }));

    //initialize user-scoped vector and insert
    const embeddings = new LocalBgeEmbeddings();
    const userVectorStore = new SupabaseVectorStore(embeddings, {
      client: supabase,
      tableName: "documents_embedding",
      queryName: "match_documents",
    })

    // 4. Store vectors
    await userVectorStore.addDocuments(docsWithMeta);

    // 5. Return result
    return { ok: true };
  // Replace the catch block at the bottom of ingestDocument
  } catch (err: any) {
    // This ensures we see the error whether it's an Object or a String
    const errorMessage = err.message || err; 
    console.error("[ingestionService] YouTube Ingestion Error:", errorMessage);

    return {
      ok: false,
      reason: errorMessage || "UNKNOWN_ERROR",
      error: errorMessage,
    };
  }
}

export async function ingestDocument(file: MulterFile, documentId: string, token: string) {
  try {
    console.log(
      "[ingestionService] Processing file upload for documentId:",
      documentId
    );

    //initialize secure user client
    const supabase = createSupabaseClient(token);
    const { data: {user}, error: authError } = await supabase.auth.getUser();
    if(authError || !user) throw new Error("[ingestionService] unauthorized: invalid token");
    const userId = user.id;

    //read the file buffer from the disk instead of relying on Multer's memory
    const fileBuffer = fs.readFileSync(file.path);

    // 1. Load and parse document
    const docs = await documentLoader(fileBuffer, file.originalname);
    console.log(
      `[ingestionService] Successfully loaded ${docs.length} document(s) from ${file.originalname}`
    );

    // 2. Split into chunks
    const chunks = await splitter.splitDocuments(docs);
    console.log(`[ingestionService] Split into ${chunks.length} chunks`);

    // 3. Attach metadata for LangChain's internal use
    const docsWithMeta = chunks.map((chunk: any) => ({
      pageContent: chunk.pageContent,
      metadata: {
        ...chunk.metadata,
        documentId, // Still keep it in metadata for safety
        userId,
        filename: file.originalname,
        uploadAt: new Date().toISOString(),
      },
    }));

    //initialize user-scoped vector and insert
    const embeddings = new LocalBgeEmbeddings();
    const userVectorStore = new SupabaseVectorStore(embeddings, {
      client: supabase,
      tableName: "documents_embedding",
      queryName: "match_documents",
    })

    // 4. Store vectors
    console.log("[ingestionService] Generating embeddings and storing in Supabase...");
    await userVectorStore.addDocuments(docsWithMeta);
    console.log(
      `[ingestionService] Successfully stored ${docsWithMeta.length} chunks in vector store`
    );

    // 5. Return result
    return {
      ok: true,
      message: `Successfully processed ${file.originalname}`,
      chunksProcessed: docsWithMeta.length,
    };
  } catch (err: any) {
    // This logs the full error regardless of type (string, object, or null)
    console.error("[ingestionService] CRITICAL ERROR:", err);

    const errorMessage = err?.message || (typeof err === 'string' ? err : "Check terminal logs for full error object");

    return {
      ok: false,
      reason: errorMessage,
      error: errorMessage,
    };
  }
}
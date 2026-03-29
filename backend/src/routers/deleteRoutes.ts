import express, { Request, Response } from "express";
import { createSupabaseClient } from "../helpers/supabseClientHelpers";

const router = express.Router();

// DELETE /api/delete/document/:documentId
router.delete("/document/:documentId", async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. EXTRACT TOKEN
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
      return;
    }
    const token = authHeader.split(' ')[1];
    const { documentId } = req.params;

    // 2. INITIALIZE USER-SCOPED CLIENT (RLS Enforced)
    const supabase = createSupabaseClient(token);

    // 3. DELETE THE DOCUMENT
    // Because of your RLS policies, this will ONLY succeed if auth.uid() matches the document's user_id.
    // Because of your ON DELETE CASCADE, this will instantly wipe all 384-dimension vectors from documents_embedding.
    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("id", documentId);

    if (error) {
      console.error("[deleteRoute] Supabase Error:", error.message);
      res.status(500).json({ error: "Failed to delete document from database" });
      return;
    }

    res.status(200).json({ success: true, message: "Document and associated AI vectors deleted successfully." });
  } catch (error: any) {
    console.error("Error in delete route:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

// DELETE /api/delete/conversation/:conversationId
router.delete("/conversation/:conversationId", async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const token = authHeader.split(' ')[1];
    const { conversationId } = req.params;

    const supabase = createSupabaseClient(token);

    //find all document IDs attached to this conversation before we delete it
    const { data: linkedDocs, error: fetchError} = await supabase
        .from("conversation_documents")
        .select("document_id")
        .eq("conversation_id", conversationId);

    if(fetchError) throw fetchError;

    //extract just the ID string into an array
    const documentIdsToWipe = linkedDocs?.map(document => document.document_id) || [];

    // This wipes the conversation, the link table, and all chat history messages via CASCADE
    const { error } = await supabase
      .from("conversations")
      .delete()
      .eq("id", conversationId);

    if (error) throw error;

    //delete the documents attach with conversationId
    if(documentIdsToWipe.length > 0){
        // First, delete embeddings that reference these documents
        const { error: embeddingError } = await supabase
            .from("documents_embedding")
            .delete()
            .in("document_id", documentIdsToWipe);

        if(embeddingError){
            console.log("[routers/deleteRoutes.ts] Failed to delete embeddings : ", embeddingError);
        }

        // Then delete the documents themselves
        const { error } = await supabase
            .from("documents")
            .delete()
            .in("id", documentIdsToWipe);

        if(error){
            console.log("[routers/deleteRoutes.ts] Failed to clean up documents : ", error);
        }
    }

    res.status(200).json({ success: true, message: "Chat session and all attached documents deleted successfully." });
  } catch (error: any) {
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

export default router;
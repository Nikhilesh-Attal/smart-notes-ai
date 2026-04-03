import express, { Request, Response } from "express";
import { createSupabaseClient } from "../helpers/supabseClientHelpers";

const router = express.Router();

// PUT /update/conversation/:conversationId
router.put("/conversation/:conversationId", async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Extract Token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
      return;
    }
    const token = authHeader.split(' ')[1];
    
    // 2. Extract ID and new title
    const { conversationId } = req.params;
    const { newTitle } = req.body;

    if (!newTitle || newTitle.trim() === "") {
      res.status(400).json({ error: "New title is required" });
      return;
    }

    // 3. Initialize secure client
    const supabase = createSupabaseClient(token);

    // 4. Update the database (RLS ensures they can only rename their own chats)
    const { error } = await supabase
      .from("conversations")
      .update({ title: newTitle })
      .eq("id", conversationId);

    if (error) {
        console.error("[updateRoute] Supabase Error:", error.message);
        throw error;
    }

    res.status(200).json({ success: true, message: "Chat renamed successfully." });
  } catch (error: any) {
    console.error("Error in update route:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

export default router;
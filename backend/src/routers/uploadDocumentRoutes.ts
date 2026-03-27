import express, { Request, Response } from "express";
import multer from "multer";
import { ingestDocument } from "../services/ingestionService";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

router.post("/", upload.single("file"), async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. EXTRACT THE SECURITY TOKEN
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
      return;
    }
    const token = authHeader.split(' ')[1];

    // 2. VALIDATE FILE
    if (!req.file) {
      res.status(400).json({ error: "No file provided" });
      return;
    }

    // 3. VALIDATE DOCUMENT ID
    const documentId = req.body.documentId;
    if (!documentId) {
      res.status(400).json({ error: "Document ID is required" });
      return;
    }

    // 4. PASS THE TOKEN TO THE INGESTION SERVICE
    const result = await ingestDocument(req.file, documentId, token);

    if (!result.ok) {
        res.status(500).json({ error: result.reason || "Upload failed" });
        return;
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in uploadDocument:", error);
    res.status(500).json({ error: "An error occurred during the upload." });
  }
});

export default router;
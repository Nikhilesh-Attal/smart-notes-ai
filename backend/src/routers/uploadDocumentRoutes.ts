import express, { Request, Response } from 'express';
import multer from 'multer';
import { ingestDocument } from "../services/ingestionService";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

router.post('/', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: "No file provided" });
            return;
        }

        const documentId = req.body.documentId;
        if (!documentId) {
            res.status(400).json({ error: "Document ID is required" });
            return;
        }

        const result = await ingestDocument(req.file, documentId);
        
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in uploadDocument: ", error);
        res.status(500).json({ error: "An error occurred during the upload." });
    }
});

export default router;

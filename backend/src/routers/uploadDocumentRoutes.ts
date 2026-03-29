import express, { Request, Response } from "express";
import multer from "multer";
import { ingestDocument } from "../services/ingestionService";
import os from "os";
import fs from "fs";

const router = express.Router();

// Configure multer for file uploads
// FIX 1: Use diskStorage instead of memoryStorage to prevent RAM crashes
const upload = multer({
  storage: multer.diskStorage({
    destination: os.tmpdir(),
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`); // create unique temporary file name
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
      'image/png',
      'image/jpeg'
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      // Rejecting the file cleanly
      cb(new Error("Unsupported file type uploaded"));
    }
  }
});

// We wrap the route logic to catch Multer errors (like file size limits or wrong types) cleanly
router.post("/", (req: Request, res: Response, next: express.NextFunction) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. EXTRACT THE SECURITY TOKEN
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      if (req.file) fs.unlinkSync(req.file.path); // FIX 2: Cleanup before rejecting
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
      fs.unlinkSync(req.file.path); // FIX 2: Cleanup before rejecting
      res.status(400).json({ error: "Document ID is required" });
      return;
    }

    // 4. PASS THE TOKEN AND FILE TO THE INGESTION SERVICE
    // Note: req.file now has a .path property pointing to the temp file on disk
    const result = await ingestDocument(req.file, documentId, token);

    // 5. FIX 2: CLEANUP - Delete the temporary file from the server
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    if (!result.ok) {
      res.status(500).json({ error: result.reason || "Upload failed" });
      return;
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in uploadDocument:", error);
    
    // FIX 2: Ensure the file is deleted even if ingestionService throws a fatal error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: "An error occurred during the upload." });
  }
});

export default router;
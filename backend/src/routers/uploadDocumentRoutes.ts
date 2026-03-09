import express from "express";
import multer from "multer";
import { uploadDocumentService } from "../services/uploadDocumentService";

const router = express.Router();

// store file temporarily in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await uploadDocumentService(req.file);

    res.json({
      message: "Document uploaded and processed",
      chunks: result.chunks
    });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
<<<<<<< HEAD
/**
 * Query Document Route
 *
 * API endpoint for document question-answering.
 * Receives user query + document context from frontend,
 * calls RAG query service, and returns AI-generated answer.
 *
 * Responsibilities:
 * - Handle HTTP request/response
 * - Call queryDocumentService
 * - Return JSON answer to client
 *
 * Does NOT contain AI, retrieval, or database logic.
 */

import express, { Request, Response, Router } from "express";
import { queryDocumentService } from "../services/queryDocumentService";

const router: Router = express.Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await queryDocumentService(req);

    if (!result.ok) {
      res.status(500).json({ error: "Query failed" });
      return;
    }

    res.json({
      answer: result.answer,
    });

  } catch (err) {
    console.error("Error in queryDocumentRoutes:", err);
    res.status(500).json({
      error: "An error occurred during the request.",
    });
  }
});

export default router;
=======
import express, { Request, Response, Router } from 'express'
import { queryDocumentService } from '../services/queryDocumentService'

const router: Router = express.Router()

router.post("/", async (req: Request, res: Response): Promise<void> =>{
    try{
        const result = await queryDocumentService(req)
        res.status(200).json(result)
    }catch(err){
        console.error("Error in queryDocumentRoutes: ",err)
        res.status(500).json({error: "An error occurred during the request."})
    }
})

export default router
>>>>>>> 93fe1ef398e2d753a267bb1a0b001e4b4daf0f27

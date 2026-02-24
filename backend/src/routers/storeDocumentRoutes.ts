import express, { Request, Response } from 'express';
import { storeDocument } from "../services/storeDocumentService";

const router = express.Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
    try{
        const result = await storeDocument(req)
        res.status(200).json(result)
    } catch (error){
        console.error("Error in storeDocument: ", error)
        res.status(500).json({ error: "An error occurred during the request."})
    }
});

export default router;
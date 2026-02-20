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
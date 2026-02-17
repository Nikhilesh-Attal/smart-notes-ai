import express, { Request, Response, Router } from 'express'
import { queryDocumentService } from '../services/queryDocumentService'

const router: Router = express.Router()

router.post("/", async (req: Request, res: Response): Promise<void> =>{
    try{
        const result = await queryDocumentService(req)
        res.status(200).json(result)
    }catch(err){
        console.log("Error in file backend/src/routers/queryDocumentRoutes : ",err)
        res.status(500).json({err: "An error occured during the request."})
    }
})

export default router
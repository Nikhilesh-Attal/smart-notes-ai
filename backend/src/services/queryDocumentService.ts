import { Request } from 'express'
import { createSupabaseClient } from '../helpers/supabseClientHelpers'

export async function queryDocumentService(req: Request){
    try{
        const { url, documentId} = req.body

        //initialize supabase client
        const supabase = createSupabaseClient()

        //1. 


    }catch(err){
        console.log("Error in file backend/src/services/queryDocumentService: ",err)
        return{
            ok: false,
        }
    }
    return{
        ok: true,
    }
}
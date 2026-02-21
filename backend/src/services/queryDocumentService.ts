import { Request } from 'express'
import { createSupabaseClient } from '../helpers/supabseClientHelpers'
import { embedTexts } from '../utils/localEmbeddings'
import { vectorStore } from '../vector/supabaseVectorStore'
import { answerFromContext } from '../ai/flan'

export async function queryDocumentService(req: Request){
    try{
        const { query, conversationId} = req.body

        //initialize supabase client
        const supabase = createSupabaseClient()

        //1. store users query
        await supabase.from("conversation_messages").insert({
            conversation_id: conversationId,
            role: "user",
            content: query,
        })

        // 2. grab the conversation history
        const previousMessages = await supabase.from("conversation_messages").select("*").eq("conversation_id", conversationId).order("created_at", { ascending: false}).limit(14)

        // 3. initialize embedding models and LLM models
        const queryEmbedding = await embedTexts(query);

        // 4. initialize the vector store and retrieve relevant documents
        const results = await vectorStore.similaritySearchVectorWithScore(queryEmbedding, 5);

        // 5. extract content from retrieved documents
        const content = results.map(([document]) => document.pageContent).join('\n');

        // 6. generate answer using query and retrieved content
        const answer = await answerFromContext(query, content);

        // 7. store the assistant's response
        await supabase.from("conversation_messages").insert({
            conversation_id: conversationId,
            role: "assistant",
            content: answer,
        });

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
{/*calling data from database
    while calling we need to pass all the embedded vectors to ai model so it an process them and generate response to user. */}

import { Request } from 'express'
import { createSupabaseClient } from '../helpers/supabseClientHelpers'
import { LocalBgeEmbeddings } from '../vector/localBgeEmbeddinds'
import { vectorStore } from '../vector/supabaseVectorStore'
import { answerFromContext } from '../ai/flan'
import { rewriteQuestionWithHistory } from '../ai/rewriteQuestion'
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'

export async function queryDocumentService(req: Request){
    let response: string;
    try{
        const { query, conversationId, documentId} = req.body

        //initialize supabase client
        const supabase = createSupabaseClient()

        //1. store users query
        await supabase.from("conversation_messages").insert({
            conversation_id: conversationId,
            role: "user",
            content: query,
        })

        // 2. grab the conversation history
        const {data: previousMessages } = await supabase.from("conversation_messages").select("*").eq("conversation_id", conversationId).order("created_at", { ascending: false}).limit(14)

        // 3. initialize embedding models and LLM models
        const embeddings = new LocalBgeEmbeddings()
        const queryEmbedding = await embeddings.embedQuery(query);

        // 4. initialize the vector store and retrieve relevant documents
        const vectorStore = new SupabaseVectorStore(embeddings, {
            client: supabase,
            tableName: "documents_embedding",
            queryName: "match_documents",
            filter: {
                document_ids: [documentId]
            }
        })

        // rewrite question using history
        const standaloneQuestion = await rewriteQuestionWithHistory(previousMessages || [], query)

        // 5. retrieve with rewritten question
        const results = await vectorStore.similaritySearch(standaloneQuestion, 5)

        const content = results.map(d => d.pageContent).join("\n")

        // 6. answer with rewritten question
        response = await answerFromContext(standaloneQuestion, content)
        
        // 7. store the assistant's response
        await supabase.from("conversation_messages").insert({
            conversation_id: conversationId,
            role: "assistant",
            content: response,
        });

        return{
            ok: true,
            answer: response
        }
    }catch(err){
        console.log("Error in file backend/src/services/queryDocumentService: ",err)
        throw err
    }
}
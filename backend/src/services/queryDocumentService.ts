{/*calling data from database
    while calling we need to pass all the embedded vectors to ai model so it an process them and generate response to user. */}

import { Request } from 'express'
import { createSupabaseClient } from '../helpers/supabseClientHelpers'
import { LocalBgeEmbeddings } from '../vector/localBgeEmbeddinds'
import { answerWithLlama } from '../ai/llamaService'
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'

export async function queryDocumentService(req: Request){
    let response: string;
    try{
        const { query, conversationId, documentIds} = req.body

        //Extract and verify the token from react
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            throw new Error("[queryDocumentService] Missing or invalid authorization header");
        }
        const token = authHeader.split(' ')[1];

        //create a secure, user-scoped supabase client
        //initialize supabase client
        const supabase = createSupabaseClient(token)

        //get verified user id from token
        const { data: {user}, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error("[queryDocumentService] unauthorized: invalid token");
        const userId = user.id;

        //1. store users query
        await supabase.from("conversation_messages").insert({
            user_id: userId,
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
                document_ids: documentIds
            }
        })

        // rewrite question using history
        
        const standaloneQuestion = query;
        //const standaloneQuestion = await rewriteQuestionWithHistory(previousMessages || [], query)

        console.log("Original Query:", query);
        console.log("Rewritten Standalone Query:", standaloneQuestion);

        // 5. retrieve with rewritten question
        const results = await vectorStore.similaritySearch(standaloneQuestion, 5);

        const content = results.map(d => d.pageContent).join("\n")

        // 6. answer with rewritten question
        response = await answerWithLlama(standaloneQuestion, content)
        
        // ADD THESE TWO LINES TO DEBUG 
        console.log("\n===== RETRIEVED CONTEXT FROM DATABASE =====");
        console.log(content ? content : "WARNING: CONTEXT IS EMPTY!");
        console.log("===========================================\n");

        // 7. store the assistant's response
        await supabase.from("conversation_messages").insert({
            user_id: userId,
            conversation_id: conversationId,
            role: "assistant",
            content: response,
        });

        const responseData = {
            ok: true,
            answer: response,
            context: content
        };

        // Debug: Log what we're sending to frontend
        console.log("\n===== SENDING RESPONSE TO FRONTEND =====");
        console.log("Answer length:", response?.length || 0);
        console.log("Context length:", content?.length || 0);
        console.log("Full response:", responseData);
        console.log("==========================================\n");

        return responseData;
    }catch(err){
        console.log("Error in file backend/src/services/queryDocumentService: ",err)
        throw err
    }
}
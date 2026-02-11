import { Request } from "express";
import { createSupabaseClient } from "../helpers/supabseClientHelpers";
import { OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export async function storeDocument(req: Request){
    try{

        const { url } = req.body;

        //initialize supabase client
        const supabase = createSupabaseClient()
        
        //initialize the embeddings
        const embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
            model: "text-embedding-3-small"
        });
        
        //initialize the vectore store
        const vectorStore = new SupabaseVectorStore(embeddings, {
            client: supabase,
            tableName: "documents",
            queryName: "match_documents",
        });

        //getting the youtube video
        const loader = new YoutubeLoader.createFromUrl(url, {
            addVideoInfo: true,
        })

        const docs = await loader.load();

        console.log(docs);

        //splitting document in chunks
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const texts = await splitter.splitDocuments(docs);

        console.log(texts);

        //adding metadata to the document

        //adding the documents to the vectore store
    }catch(error){
        console.error('Error in file backend/src/services/storeDocumentService.ts: ', error);

        return{ ok: false,}
    }

    return{ ok: true };
};
import { createSupabaseClient } from "../helpers/supabseClientHelpers"
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase"
import { LocalBgeEmbeddings } from "./localBgeEmbeddinds"

const supabase = createSupabaseClient()

export const vectorStore = new SupabaseVectorStore(
  new LocalBgeEmbeddings() as any,
  {
    client: supabase,
    tableName: "documents_embedding",
    queryName: "match_documents",
  }
)

export async function matchDocuments(
  embedding: number[],
  k: number
) {
  try {
    const { data, error } = await supabase.rpc(
      'match_documents',
      {
        query_embedding: embedding,
        match_count: k,
      }
    );

    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error in matchDocuments:", error);
    throw error;
  }
}
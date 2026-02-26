import { createSupabaseClient } from "../helpers/supabseClientHelpers"
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase"
import { LocalBgeEmbeddings } from "./localBgeEmbeddinds"

const supabase = createSupabaseClient()

export const vectorStore = new SupabaseVectorStore(
  new LocalBgeEmbeddings() as any,
  {
    client: supabase,
<<<<<<< HEAD
    tableName: "documents_embedding",
=======
    tableName: "documents_embbeding",
>>>>>>> 93fe1ef398e2d753a267bb1a0b001e4b4daf0f27
    queryName: "match_documents",
  }
)

export async function matchDocuments(
  embedding: number[],
  k: number
) {
<<<<<<< HEAD
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
=======
  const { data } = await supabase.rpc(
    'match_documents',
    {
      query_embedding: embedding,
      match_count: k,
    }
  );

  return data;
>>>>>>> 93fe1ef398e2d753a267bb1a0b001e4b4daf0f27
}
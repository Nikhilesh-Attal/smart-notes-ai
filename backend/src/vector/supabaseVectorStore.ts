import { createSupabaseClient } from "../helpers/supabseClientHelpers"
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase"
import { LocalBgeEmbeddings } from "./localBgeEmbeddinds"

const supabase = createSupabaseClient()

export const vectorStore = new SupabaseVectorStore(
  new LocalBgeEmbeddings() as any,
  {
    client: supabase,
    tableName: "documents_embbeding",
    queryName: "match_documents",
  }
)
import { embedTexts } from "../utils/localEmbeddings"

export class LocalBgeEmbeddings {
  async embedDocuments(texts: string[]) {
    return embedTexts(texts)
  }

  async embedQuery(text: string) {
    const [vec] = await embedTexts([text])
    return vec
  }
}
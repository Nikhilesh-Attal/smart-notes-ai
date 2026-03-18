{/*These models prefer slightly different chunk sizes:

BGE: fine with 500–1200 chars

FLAN: performs best with ~300–800 token context windows per chunk

Your 1000 char chunks are fine, but slightly large for FLAN QA. */}

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 800,
  chunkOverlap: 150,
});

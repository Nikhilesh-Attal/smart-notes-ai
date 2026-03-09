export const chunkText = (text: string, size = 500, overlap = 100) => {

  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {

    const end = start + size;
    const chunk = text.slice(start, end);

    chunks.push(chunk);

    start += size - overlap;
  }

  return chunks;
};
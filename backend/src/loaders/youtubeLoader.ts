import { getYoutubeTranscript } from "../utils/youtubeTranscript";

export async function youtubeLoader(url: string) {
  console.log(`[YoutubeLoader] Processing URL: ${url}`); // LOG 1: Prove we started

  try {
    const transcriptText = await getYoutubeTranscript(url);
    console.log(`[YoutubeLoader] Success! Transcript found.`); // LOG 2: Prove success

    return [
      {
        pageContent: transcriptText,
        metadata: {
          source: url,
          type: "youtube",
        },
      },
    ];
  } catch (err: any) {
    // LOG 3: PRINT THE REAL ERROR
    console.error("========================================");
    console.error("CRITICAL ERROR in youtubeLoader:");
    console.error(err); 
    console.error("========================================");
    
    // Pass through the actual error message instead of generic one
    throw err; 
  }
}
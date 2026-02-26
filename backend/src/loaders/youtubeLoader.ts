<<<<<<< HEAD
import { YoutubeTranscript } from "youtube-transcript";
import { getYoutubeTranscript } from "../utils/youtubeTranscript";

export async function youtubeLoader(url: string) {

  console.log("[youtubeLoader] captions-first loader active");
  
  // 1️ Try captions first
  try {
    const captions = await YoutubeTranscript.fetchTranscript(url);

    if (captions?.length) {
      const text = captions.map(c => c.text).join(" ");
      return [
        {
          pageContent: text,
          metadata: { 
            source: url, 
            type: "caption" 
          },
        },
      ];
    }
  } catch (err) {
    console.log("[youtubeLoader] Captions unavailable, using audio fallback");
  }

  // 2️ Fallback to your existing pipeline
  const transcript = await getYoutubeTranscript(url);

  return [
    {
      pageContent: transcript,
      metadata: { 
        source: url, 
        type: "whisper" 
      },
    },
  ];
=======
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
>>>>>>> 93fe1ef398e2d753a267bb1a0b001e4b4daf0f27
}
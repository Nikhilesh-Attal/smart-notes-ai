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
}
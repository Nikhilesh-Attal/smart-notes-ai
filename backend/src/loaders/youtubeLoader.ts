import { getYoutubeTranscript } from "../utils/youtubeTranscript";

export async function youtubeLoader(url: string) {
  try {
    const transcriptText = await getYoutubeTranscript(url);

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
    throw new Error("YOUTUBE_NO_TRANSCRIPT");
  }
}

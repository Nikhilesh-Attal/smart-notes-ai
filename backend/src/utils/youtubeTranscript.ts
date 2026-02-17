import fetch from "node-fetch";
import { parseStringPromise } from "xml2js";

export function extractVideoId(url: string): string | null {
  const regExp = /(?:v=|\/)([0-9A-Za-z_-]{11}).*/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

export async function getYoutubeTranscript(url: string): Promise<string> {
  const videoId = extractVideoId(url);

  if (!videoId) {
    throw new Error("Invalid YouTube URL");
  }

  const transcriptUrl = `https://video.google.com/timedtext?lang=en&v=${videoId}`;

  const response = await fetch(transcriptUrl);

  if (!response.ok) {
    throw new Error("Transcript not available for this video");
  }

  const xml = await response.text();

  const parsed = await parseStringPromise(xml);

  if (!parsed?.transcript?.text) {
    throw new Error("No transcript data found");
  }

  const transcriptText = parsed.transcript.text
    .map((t: any) => t._)
    .join(" ");

  return transcriptText;
}

import { spawn } from "child_process"
import path from "path"
import fs from "fs"
import { v4 as uuidv4 } from "uuid"

export const getYoutubeTranscript = async (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log(`[YoutubeTranscript] Starting for URL: ${url}`)

    // Resolve backend root
    const rootDir = path.resolve(__dirname, "../../")
    const ytDlpPath = path.join(rootDir, "yt-dlp.exe")
    const pythonScriptPath = path.join(rootDir, "transcribe.py")
    const tempDir = path.join(rootDir, "tmp", "yt")

    console.log(`[YoutubeTranscript] rootDir resolved to: ${rootDir}`)
    console.log(`[YoutubeTranscript] ytDlpPath: ${ytDlpPath}`)
    console.log(`[YoutubeTranscript] transcribe.py: ${pythonScriptPath}`)

    // ensure temp dir exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    if (!fs.existsSync(ytDlpPath)) {
      return reject(new Error(`yt-dlp.exe not found at ${ytDlpPath}`))
    }

    if (!fs.existsSync(pythonScriptPath)) {
      return reject(new Error(`transcribe.py not found at ${pythonScriptPath}`))
    }

    console.log(`[1/2] Spawning yt-dlp...`)

    const videoId = url.split('v=')[1]?.split('&')[0] || uuidv4(); // Get unique ID
    const outputFilename = `${videoId}.mp3`;
    const audioPath = path.join(tempDir, outputFilename);

    const args = [
      "--no-playlist",
      "-x",
      "--audio-format", "mp3",
      "-o", audioPath, // Force specific filename
      url,
    ];

    const downloader = spawn(ytDlpPath, args)

    // Log yt-dlp progress
    downloader.stdout.on("data", (d) => {
      console.log(`[yt-dlp]: ${d.toString().trim()}`)
    })

    // Capture errors
    let ytDlpError = ""
    downloader.stderr.on("data", (d) => {
      ytDlpError += d.toString()
      console.error(`[yt-dlp stderr]: ${d.toString().trim()}`)
    })

    downloader.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`yt-dlp failed (exit code ${code}): ${ytDlpError}`))
      }

      // find newest mp3 in temp dir
      const files = fs
        .readdirSync(tempDir)
        .filter((f) => f.endsWith(".mp3"))
        .map((f) => ({
          name: f,
          time: fs.statSync(path.join(tempDir, f)).mtime.getTime(),
        }))
        .sort((a, b) => b.time - a.time)

      if (files.length === 0) {
        return reject(new Error("No audio file found after yt-dlp"))
      }

      if (!fs.existsSync(audioPath)) {
        return reject(new Error(`Audio file not found at ${audioPath}`));
      }

      console.log(`[2/2] Audio saved: ${files[0].name}. Spawning Python transcriber...`)

      // Look at what variable you used to have here instead of audioFilePath
      const transcriber = spawn('venv/Scripts/python.exe', ['transcribe.py', audioPath]);

      let transcript = ""
      let errorLog = ""

      transcriber.stdout.on("data", (d) => {
        transcript += d.toString()
      })

      transcriber.stderr.on("data", (d) => {
        errorLog += d.toString()
        console.error(`[Whisper stderr]: ${d.toString().trim()}`)
      })

      transcriber.on("close", (pCode) => {
        if (pCode !== 0) {
          console.error(`[Python Error]: ${errorLog}`)
          return reject(new Error(`Whisper transcription failed: ${errorLog}`))
        }

        // delete audio only after success
        if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath)

        console.log(`[Success] Transcript length: ${transcript.length} chars`)
        resolve(transcript.trim())
      })
    })
  })
}
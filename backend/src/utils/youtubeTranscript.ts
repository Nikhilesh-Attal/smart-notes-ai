import { spawn } from "child_process"
import path from "path"
import fs from "fs"

export const getYoutubeTranscript = async (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log(`[YoutubeTranscript] Starting for URL: ${url}`)

    const rootDir = process.cwd()
    const ytDlpPath = path.join(rootDir, "yt-dlp.exe")
    const pythonScriptPath = path.join(rootDir, "transcribe.py")
    const tempDir = path.join(rootDir, "tmp", "yt")

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

    const args = [
      "-x",
      "--audio-format",
      "mp3",
      "--no-write-subs",
      "--no-write-auto-subs",
      "-o",
      path.join(tempDir, "%(id)s.%(ext)s"),
      url,
    ]

    const downloader = spawn(ytDlpPath, args)

    downloader.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`yt-dlp failed with exit code ${code}`))
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

      const audioPath = path.join(tempDir, files[0].name)

      console.log(`[2/2] Audio saved: ${files[0].name}. Spawning Python...`)

      const transcriber = spawn("python", [pythonScriptPath, audioPath])

      let transcript = ""
      let errorLog = ""

      transcriber.stdout.on("data", (d) => (transcript += d.toString()))
      transcriber.stderr.on("data", (d) => (errorLog += d.toString()))

      transcriber.on("close", (pCode) => {
        // cleanup
        if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath)

        if (pCode !== 0) {
          console.error(`[Python Error]: ${errorLog}`)
          return reject(new Error(`Whisper failed: ${errorLog}`))
        }

        console.log(`[Success] Transcript length: ${transcript.length}`)
        resolve(transcript.trim())
      })
    })
  })
}
import { spawn } from "child_process"
import path from "path"
import fs from "fs"

export const getYoutubeTranscript = async (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log(`[YoutubeTranscript] Starting for URL: ${url}`)

<<<<<<< HEAD
    // Use __dirname — always points to this file's directory (backend/src/utils/)
    const rootDir = path.resolve(__dirname, "../../")
=======
    const rootDir = process.cwd()
>>>>>>> 93fe1ef398e2d753a267bb1a0b001e4b4daf0f27
    const ytDlpPath = path.join(rootDir, "yt-dlp.exe")
    const pythonScriptPath = path.join(rootDir, "transcribe.py")
    const tempDir = path.join(rootDir, "tmp", "yt")

<<<<<<< HEAD
    console.log(`[YoutubeTranscript] rootDir resolved to: ${rootDir}`)
    console.log(`[YoutubeTranscript] ytDlpPath: ${ytDlpPath}`)
    console.log(`[YoutubeTranscript] transcribe.py: ${pythonScriptPath}`)

=======
    // ensure temp dir exists
>>>>>>> 93fe1ef398e2d753a267bb1a0b001e4b4daf0f27
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
<<<<<<< HEAD
      "--no-playlist",
      "-x",
      "--audio-format", "mp3",
      "--no-write-subs",
      "--no-write-auto-subs",
      "-o", path.join(tempDir, "%(id)s.%(ext)s"),
=======
      "-x",
      "--audio-format",
      "mp3",
      "--no-write-subs",
      "--no-write-auto-subs",
      "-o",
      path.join(tempDir, "%(id)s.%(ext)s"),
>>>>>>> 93fe1ef398e2d753a267bb1a0b001e4b4daf0f27
      url,
    ]

    const downloader = spawn(ytDlpPath, args)

<<<<<<< HEAD
    // Log yt-dlp output so you can see download progress
    downloader.stdout.on("data", (d) => {
      console.log(`[yt-dlp]: ${d.toString().trim()}`)
    })

    // Capture yt-dlp errors for useful reject messages
    let ytDlpError = ""
    downloader.stderr.on("data", (d) => {
      ytDlpError += d.toString()
      console.error(`[yt-dlp stderr]: ${d.toString().trim()}`)
    })

    downloader.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`yt-dlp failed (exit code ${code}): ${ytDlpError}`))
      }

=======
    downloader.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`yt-dlp failed with exit code ${code}`))
      }

      // find newest mp3 in temp dir
>>>>>>> 93fe1ef398e2d753a267bb1a0b001e4b4daf0f27
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
<<<<<<< HEAD
      console.log(`[2/2] Audio saved: ${files[0].name}. Spawning Python transcriber...`)
=======

      console.log(`[2/2] Audio saved: ${files[0].name}. Spawning Python...`)
>>>>>>> 93fe1ef398e2d753a267bb1a0b001e4b4daf0f27

      const transcriber = spawn("python", [pythonScriptPath, audioPath])

      let transcript = ""
      let errorLog = ""

      transcriber.stdout.on("data", (d) => (transcript += d.toString()))
<<<<<<< HEAD
      transcriber.stderr.on("data", (d) => {
        errorLog += d.toString()
        console.error(`[Whisper stderr]: ${d.toString().trim()}`)
      })

      transcriber.on("close", (pCode) => {
        // Only delete on success so you can debug failed audio
        if (pCode !== 0) {
          console.error(`[Python Error]: ${errorLog}`)
          return reject(new Error(`Whisper transcription failed: ${errorLog}`))
        }

        if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath)

        console.log(`[Success] Transcript length: ${transcript.length} chars`)
=======
      transcriber.stderr.on("data", (d) => (errorLog += d.toString()))

      transcriber.on("close", (pCode) => {
        // cleanup
        if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath)

        if (pCode !== 0) {
          console.error(`[Python Error]: ${errorLog}`)
          return reject(new Error(`Whisper failed: ${errorLog}`))
        }

        console.log(`[Success] Transcript length: ${transcript.length}`)
>>>>>>> 93fe1ef398e2d753a267bb1a0b001e4b4daf0f27
        resolve(transcript.trim())
      })
    })
  })
}
import { spawn } from "child_process"
import path from "path"

export async function embedTexts(texts: string[]): Promise<number[][]> {
  return new Promise((resolve, reject) => {
    const script = path.join(process.cwd(), "embed.py")
    const py = spawn("python", [script])

    let out = ""
    let err = ""

    py.stdout.on("data", (d) => (out += d.toString()))
    py.stderr.on("data", (d) => (err += d.toString()))

    py.on("close", (code) => {
      if (code !== 0) return reject(err)
      resolve(JSON.parse(out))
    })

    py.stdin.write(JSON.stringify(texts))
    py.stdin.end()
  })
}
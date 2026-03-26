import { spawn } from "child_process"
import path from "path"

export async function embedTexts(texts: string[]): Promise<number[][]> {
  return new Promise((resolve, reject) => {
    const script = path.join(process.cwd(), "embed.py");
    
    // TIP: On some systems you must use "python3" instead of "python"
    const py = spawn("python", [script]);

    let out = "";
    let err = "";

    py.stdout.on("data", (d) => (out += d.toString()));
    py.stderr.on("data", (d) => (err += d.toString()));

    py.on("close", (code) => {
      // If code is 0, we succeeded. We ignore whatever is in 'err' because
      // it's likely just HF/Bert warnings that we couldn't suppress.
      if (code === 0) {
        try {
          resolve(JSON.parse(out));
        } catch (parseError) {
          reject(`Failed to parse Python JSON. Output was: ${out}`);
        }
      } else {
        // Only reject if the code is non-zero (Actual Crash)
        reject(err || `Python process failed with code ${code}`);
      }
    });

    py.stdin.write(JSON.stringify(texts));
    py.stdin.end();
  });
}
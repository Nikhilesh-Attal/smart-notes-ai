const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// 1. SETUP
const TEST_URL = 'https://www.youtube.com/watch?v=a329vAPgpaE';
const YTDLP_PATH = path.join(__dirname, 'yt-dlp.exe');
const PYTHON_SCRIPT = path.join(__dirname, 'transcribe.py');
const TEMP_FILE = path.join(__dirname, 'debug_test_audio.mp3');

console.log("=== 🔍 STARTING ISOLATION TEST ===");
console.log(`📂 Working Directory: ${__dirname}`);

// 2. CHECK FILES
if (!fs.existsSync(YTDLP_PATH)) {
    console.error("❌ FATAL: yt-dlp.exe NOT FOUND at:", YTDLP_PATH);
    console.error("   -> Please move yt-dlp.exe into the backend folder.");
    process.exit(1);
} else {
    console.log("✅ yt-dlp.exe found.");
}

if (!fs.existsSync(PYTHON_SCRIPT)) {
    console.error("❌ FATAL: transcribe.py NOT FOUND at:", PYTHON_SCRIPT);
    console.error("   -> Please create the transcribe.py file.");
    process.exit(1);
} else {
    console.log("✅ transcribe.py found.");
}

// 3. TEST DOWNLOAD
console.log("\n⬇️  Step 1: Attempting Download with yt-dlp...");
const ytProcess = spawn(YTDLP_PATH, [
    '-x', '--audio-format', 'mp3', '-o', TEMP_FILE, TEST_URL
]);

ytProcess.stderr.on('data', (data) => console.log(`   [yt-dlp log]: ${data}`));

ytProcess.on('close', (code) => {
    if (code !== 0) {
        console.error(`\n❌ DOWNLOAD FAILED with code ${code}`);
        return;
    }
    console.log("✅ Download Successful!");

    // 4. TEST TRANSCRIPTION
    console.log("\n🧠 Step 2: Attempting Transcription with Python...");
    if (!fs.existsSync(TEMP_FILE)) {
        console.error("❌ FATAL: Audio file missing despite success message.");
        return;
    }

    const pyProcess = spawn('python', [PYTHON_SCRIPT, TEMP_FILE]);

    pyProcess.stdout.on('data', (data) => console.log(`   [Python Output]: ${data}`));
    pyProcess.stderr.on('data', (data) => console.log(`   [Python Error]: ${data}`));

    pyProcess.on('close', (pCode) => {
        if (pCode !== 0) {
            console.error(`\n❌ TRANSCRIPTION FAILED with code ${pCode}`);
        } else {
            console.log("\n🎉 SUCCESS! The pipeline is working correctly.");
            // Cleanup
            try { fs.unlinkSync(TEMP_FILE); } catch(e) {}
        }
    });
});
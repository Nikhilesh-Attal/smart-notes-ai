🧠 Smart Notes AI — Local Generative Study Assistant
Ask questions from your own lectures and documents. Answers are generated strictly from your content using fully local AI.

📖 Overview

Smart Notes AI is a Retrieval-Augmented Generation (RAG) system that converts personal learning material into an interactive AI tutor.

The system currently supports:

YouTube lectures (captions + audio transcription fallback)

Local embeddings

Local answer generation

All AI runs locally — no external LLM or embedding APIs.

🚀 Key Technical Differentiators
1️⃣ Audio-Fallback YouTube Ingestion

YouTube is not a text source. Many lectures lack captions.
When captions are unavailable, the backend switches to an audio pipeline:

YouTube URL
→ yt-dlp downloads audio
→ ffmpeg decodes audio
→ Python faster-whisper transcribes speech
→ text returned to Node

This makes nearly all lectures ingestible.

2️⃣ 100% Local, Free AI Architecture

The entire RAG stack runs locally.

Embeddings
Model: BAAI/bge-small-en-v1.5
Runtime: Python sentence-transformers
Integration: Node ↔ Python via stdin/stdout
Cost: 0

Answer Generation
Model: FLAN-T5-Base (Xenova)
Runtime: Transformers.js (Node)
Size: ~250 MB
Offline: Yes

Result:
No API keys, no usage limits, full data privacy.

🏗️ System Architecture
graph TD

User --> Frontend
Frontend --> Backend

subgraph "Ingestion"
Backend --> YouTubeLoader
YouTubeLoader -->|captions| Text
YouTubeLoader -->|no captions| AudioPipeline
AudioPipeline --> yt-dlp
yt-dlp --> ffmpeg
ffmpeg --> Whisper[Python faster-whisper]
Whisper --> Text
Text --> Chunker
Chunker --> Embeddings[BGE Local]
Embeddings --> Supabase[(Vector DB)]
end

subgraph "Query"
Backend --> QueryService
QueryService --> Supabase
Supabase --> Context
Context --> FLAN[FLAN-T5 Local]
FLAN --> Answer
Answer --> Frontend
end


🧠 AI Stack
Transcription

faster-whisper (Python)

Embeddings
BAAI/bge-small-en-v1.5

sentence-transformers
LLM
Xenova/flan-t5-base
Transformers.js

📂 Project Structure
Frontend
frontend/
  src/
    api/
      api.tsx   <-in this file we declare code related to supabase
    context/
      AuthContext.tsx
    components/
      Navbar.tsx
      Footer.tsx
    pages/
      Home.tsx
      Login.tsx
      Signup.tsx
    App.tsx
    main.tsx
Backend
backend/
  ai/
    flan.ts
  src/
    loaders/
      youtubeLoader.ts
    services/
      ingestionService.ts
      queryDocumentService.ts
    vector/
      supabaseVectorStore.ts
    utils/
      localEmbeddings.ts
      youtubeTranscript.ts
  embed.py
  transcribe.py
  yt-dlp.exe

⚙️ Installation & Setup
1️⃣ Clone
git clone https://github.com/Nikhilesh-Attal/smart-notes-ai.git
cd smart-notes-ai

🧩 Backend Setup
Install Node deps
cd backend
npm install
🐍 Python Setup

Install Python 3.10+.

Create venv:

python -m venv .venv
.venv\Scripts\activate

Install Python deps:

pip install faster-whisper
pip install sentence-transformers
pip install torch
pip install ffmpeg-python
🎧 Install ffmpeg
Windows (recommended)

Download:
https://www.gyan.dev/ffmpeg/builds/

Add ffmpeg/bin to PATH.

Verify:

ffmpeg -version
📺 yt-dlp

Already included in repo (yt-dlp.exe).

If needed:

pip install yt-dlp
🔐 Environment Variables

Create backend/.env

PORT=5000
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
▶️ Run Backend
npm run dev

First run downloads:

FLAN-T5 (~250 MB)

BGE embeddings (~130 MB)

Whisper model (~150-500 MB)

🎨 Frontend
cd ../frontend
npm install
npm run dev
💬 Example Flow

Paste YouTube lecture URL

Backend stores lecture in Supabase

Ask:
“Explain the algorithm discussed”
“Summarize the lecture”
FLAN generates answer from lecture context

Tech stack:
tailwind css v4

👥 Team

Nikhilesh Attal — Backend & AI Architecture
Lavish Singhvi — Frontend
Pankaj Gadwal — AI Models & Prompts
Palak Agarwal — Integration & Testing

📄 License

MIT License
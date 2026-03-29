🧠 Smart Notes AI
Local Generative Study Assistant & RAG Pipeline

Smart Notes AI is a highly secure, completely offline-capable Retrieval-Augmented Generation (RAG) system. It transforms personal study materials—ranging from PDFs to YouTube lectures—into an interactive, context-aware AI tutor.

Built with an emphasis on data privacy, zero-cost scaling, and multi-tenant architecture, the entire AI stack (Embeddings, LLM generation, and Transcription) runs locally on the host machine without relying on paid external APIs like OpenAI or Anthropic.

📖 Overview

Smart Notes AI is a Retrieval-Augmented Generation (RAG) system that converts personal learning material into an interactive AI tutor.

The system currently supports:

YouTube lectures (captions + audio transcription fallback)

Local embeddings

Local answer generation

All AI runs locally — no external LLM or embedding APIs.

🚀 Key Technical Differentiators
1️⃣ 100% Local, Offline-First AI Architecture
The entire cognitive stack executes locally. We strictly enforce offline modes (HF_HUB_OFFLINE=1) to prevent data leaks.

Embeddings: BAAI/bge-small-en-v1.5 via Python sentence-transformers.

Generation: Xenova/flan-t5-base via Node.js Transformers.js.

Benefit: Zero API costs, zero rate limits, and absolute data privacy.

2️⃣ Advanced Multi-Document Chat Engine
Users aren't restricted to chatting with a single file. The dynamic vector retrieval pipeline allows users to upload an array of documents (PDFs + YouTube videos) into a single workspace and query them simultaneously, with the AI synthesizing answers across multiple sources.

3️⃣ Enterprise-Grade Security & Persistence
Row Level Security (RLS): Database strictly enforces auth.uid() = user_id, guaranteeing that users can only query their own embedded vectors.

Session Management: Utilizes secure JWTs with 3-day strict expiries and robust sessionStorage state management in React to prevent UI amnesia on refresh.

4️⃣ Audio-Fallback YouTube Ingestion
YouTube is not natively a text source. For lectures lacking closed captions, our backend automatically dynamically reroutes to an audio-processing pipeline:
URL → yt-dlp → ffmpeg (audio extraction) → faster-whisper (speech-to-text) → Vector Store

Result:
No API keys, no usage limits, full data privacy.

🏗️ System Architecture
graph TD
    User -->|Auth & Queries| Frontend(React + Vite)
    Frontend -->|Bearer Token + Data| Backend(Node.js / Express)

    subgraph "Ingestion Pipeline"
        Backend --> PDFParser[PDF Buffer Parser]
        Backend --> YTLoader[YouTube Loader]
        YTLoader -->|Captions Found| TextSanitizer
        YTLoader -->|No Captions| AudioFallback[yt-dlp + ffmpeg]
        AudioFallback --> Whisper[Python faster-whisper]
        Whisper --> TextSanitizer
        PDFParser --> TextSanitizer
        TextSanitizer --> Chunker
        Chunker --> Embeddings[Python local-bge Bridge]
    end

    subgraph "Database & Security"
        Embeddings --> Supabase[(Supabase pgvector)]
        Supabase -.->|Row Level Security| RLS{Auth Barrier}
    end

    subgraph "Query Pipeline"
        Backend --> QueryService
        QueryService --> RLS
        RLS -->|Verified| Context[Array of Document Vectors]
        Context --> FLAN[Transformers.js FLAN-T5]
        FLAN -->|Strict Fact Generation| Answer
        Answer --> Frontend
    end

🧠 AI Stack
Frontend:-
  React (Vite)
  TypeScript
  Tailwind CSS v4
  Supabase Client (Auth & Session State)

Backend Core:-
  Node.js / Express
  Supabase (PostgreSQL + pgvector)
  LangChain Community (SupabaseVectorStore)

AI & Processing:-
  Transcription: faster-whisper (Python)
  Embeddings: BAAI/bge-small-en-v1.5 (Python)
  LLM: Xenova/flan-t5-base (Node.js)

Media Handling:-
  ffmpeg-python
  yt-dlp

📂 Project Structure
Frontend
frontend/
  src/
    api/
      api.tsx   <-in this file we declare code related to supabase
    context/
      AuthContext.tsx
    components/
      ChatWindow.tsx
      FileUpload.tsx
      PrivateRoute.tsx
      Input.tsx
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
  src/
    ai/
      flan.ts
      rewriteQuestion.ts
    config/
      splitter.ts <--here we defin size of chunk in which document will be split
    helper\
      supabaseClientHelpers.ts  <--here we call the supabase keys and connect supabase with project
    loaders/
      youtubeLoader.ts
      documentLoader.ts <--this file contains code of parser
    routers\
      queryDocumentRoutes.ts
      storeDocumentRoutes.ts
      uploadDocuemtRoutes.ts  <--here we defin size of document, authorize person upload document
    services/
      ingestionService.ts <--this is main file. this handle every things and send data finally in suabase
      queryDocumentService.ts
      storeDocumentService.ts
      uploadDocumentService.ts
    vector/
      localBgeEmbeddings.ts
      supabaseVectorStore.ts
    utils/
      chunkText.ts
      localEmbeddings.ts
      youtubeTranscript.ts
    app.ts
    server.ts
    mammoth.d.ts
    parsers.d.ts
  embed.py
  transcribe.py
  yt-dlp.exe

⚙️ Installation & Setup
1. Repository Setup
Bash
git clone https://github.com/Nikhilesh-Attal/smart-notes-ai.git
cd smart-notes-ai
2. Python Environment (AI Bridge)
The Python environment handles local embeddings and Whisper transcriptions. Requires Python 3.10+.

Bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# Mac/Linux
source .venv/bin/activate

pip install faster-whisper sentence-transformers torch ffmpeg-python yt-dlp
3. Install FFmpeg (Required for Audio Processing)
Windows: Download from gyan.dev and add ffmpeg/bin to your system PATH.

Mac: brew install ffmpeg

Verify: Run ffmpeg -version in your terminal.

4. Backend Configuration
Bash
cd backend
npm install
Create a .env file in the /backend directory:

Code snippet
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key
HF_HUB_OFFLINE=1
TRANSFORMERS_OFFLINE=1
Start the backend:

Bash
npm run dev
(Note: On the very first run, the backend will download the FLAN-T5 model (~250MB) and BGE embeddings (~130MB). Subsequent runs will be entirely offline).

5. Frontend Configuration
Bash
cd ../frontend
npm install
npm run dev

💬 Usage Workflow
Secure Login: Create an account or sign in via the Auth dashboard.

Create a Workspace: Click "New Note" in the sidebar.

Ingest Data: Upload a local PDF document or paste a YouTube lecture URL.

Expand Context: Continue uploading multiple documents into the same chat session.

Interact: Ask the AI questions (e.g., "Summarize the core arguments from both the video and the PDF in 300 words"). The AI will dynamically adjust its token limits and retrieve strictly from your isolated context chunks.

👥 Team

Nikhilesh Attal — Backend & AI Architecture
Lavish Singhvi — Frontend
Pankaj Gadwal — AI Models & Prompts
Palak Agarwal — Integration & Testing

📄 License

MIT License
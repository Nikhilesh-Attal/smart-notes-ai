# 🧠 Smart Notes AI: The Generative Study Assistant

![Project Status](https://img.shields.io/badge/Status-Active_Development-green)
![Tech Stack](https://img.shields.io/badge/Stack-MERN_%2B_LangChain-blue)
![AI Model](https://img.shields.io/badge/AI-Llama3_via_Groq-orange)
![Embeddings](https://img.shields.io/badge/Embeddings-Local_Xenova-purple)

> **A Next-Generation RAG Application that turns static PDFs into an interactive AI Tutor.**

---

## 📖 Introduction
**Smart Notes AI** is not just a PDF summarizer. It is a **Retrieval-Augmented Generation (RAG)** engine designed to revolutionize how students interact with study materials. 

Unlike traditional tools that simply "extract" text, Smart Notes AI **understands** context. It uses vector embeddings to perform semantic search and Generative AI to rewrite complex concepts into simple, student-friendly explanations.

### 🚀 Why This Project is Different (The "Update Technique")
Most existing projects rely heavily on slow, expensive external APIs for every step. We implemented a **Hybrid Edge Architecture**:
1.  **Local "Edge" Embeddings:** We run the Vectorization model (`all-MiniLM-L6-v2`) locally on the server using `@xenova/transformers`. This ensures **100% data privacy** during the indexing phase and zero API costs for processing large documents.
2.  **Hyper-Fast Inference:** We utilize the **Groq API** (Llama-3-8b) for the final answer generation, providing near-instant responses (500+ tokens/sec) compared to standard GPT-4 latency.

---

## ✨ Key Features
* **📄 Intelligent PDF Ingestion:** Upload lecture slides or textbooks. The system intelligently chunks text (preserving paragraph context) using LangChain.
* **🧠 Semantic Search:** Finds answers based on *meaning*, not just keywords. (e.g., searching "finance" will find content about "money management").
* **💬 Interactive AI Tutor:** Chat with your PDF. Ask questions like *"Explain this formula like I'm 5"* or *"Generate a quiz from Chapter 3."*
* **⚡ Hybrid Performance:** Local embeddings for speed/privacy + Cloud LLM for intelligence.
* **📱 Modern UI:** Built with React + Vite, featuring streaming responses and a clean, student-focused design.

---

## 🛠️ Tech Stack

### **Frontend (Client)**
* **Framework:** React.js (Vite)
* **Styling:** Tailwind CSS + Lucide Icons
* **State/Animation:** Framer Motion
* **PDF Handling:** `react-pdf`

### **Backend (Server)**
* **Runtime:** Node.js + Express.js
* **Orchestration:** LangChain.js
* **Database:** Supabase (PostgreSQL + `pgvector` extension)
* **Embeddings:** `@xenova/transformers` (Running Locally)
* **LLM Inference:** Groq SDK (Llama-3-8b-8192)

---

## 🏗️ System Architecture

```mermaid
graph TD
    User[Student] -->|Upload PDF| Frontend
    Frontend -->|Send File| Backend
    
    subgraph "Backend (Node.js)"
        Backend -->|Parse Text| PDFParser
        PDFParser -->|Chunk Text| LangChain
        LangChain -->|Generate Vector| LocalEmbeddings[Xenova Local Model]
    end
    
    subgraph "Database"
        LocalEmbeddings -->|Store Vector + Text| Supabase[Supabase pgvector]
    end
    
    subgraph "RAG Pipeline"
        User -->|Ask Question| Frontend
        Frontend -->|Send Query| Backend
        Backend -->|Vector Search| Supabase
        Supabase -->|Return Relevant Chunks| Backend
        Backend -->|Context + Question| Groq[Groq API (Llama-3)]
        Groq -->|Generative Answer| Frontend
    end
⚙️ Installation & Setup
Follow these steps to run the project locally.

1. Clone the Repository
Bash
git clone [https://github.com/Nikhilesh-Attal/smart-notes-ai.git](https://github.com/Nikhilesh-Attal/smart-notes-ai.git)
cd smart-notes-ai
2. Backend Setup
Navigate to the backend folder and install dependencies:

Bash
cd backend
npm install
Create a .env file in the backend/ root:

Code snippet
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
Run the Server:

Bash
npm run dev
# Server will start on http://localhost:5000
3. Frontend Setup
Open a new terminal, navigate to the frontend folder:

Bash
cd ../frontend
npm install
Create a .env file in the frontend/ root:

Code snippet
VITE_API_URL=http://localhost:5000
Run the Client:

Bash
npm run dev
# App will open at http://localhost:5173
🧑‍💻 Team Members
Nikhilesh Attal - Team Lead & Backend Architect

Lavish Singhvi - Frontend Developer & UI/UX

Pankaj Gadwal - AI Engineer (Model Evaluation & Prompts)

Palak Agarwal - Full Stack Integration & Documentation

🔮 Future Roadmap
[ ] Flashcard Generation: Automatically create Anki-style flashcards from notes.

[ ] Multi-File Chat: Chat across multiple PDFs simultaneously.

[ ] Voice Mode: Speak to the AI tutor instead of typing.

📄 License
This project is open-source and available under the MIT License.
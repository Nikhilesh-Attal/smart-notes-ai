import "./App.css";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Input from "./components/Input";
import { createSupabaseClient } from "./api/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function App() {
  /** ===============================
   * Ingestion + conversation state
   * =============================== */
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [conversationId, setConversationId] = useState<string | null>(null);

  // keep array for future multi-document support
  const [documentIds, setDocumentIds] = useState<string[]>([]);

  /** ===============================
   * Chat state
   * =============================== */
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const [answering, setAnswering] = useState(false);

  /** ===============================
   * Handle document ingestion
   * =============================== */
  const handleStoreDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    try {
      setLoading(true);

      const convId = uuidv4();
      const docId = uuidv4();

      const supabase = createSupabaseClient();

      // create conversation
      await supabase.from("conversations").insert({ id: convId });

      // create document
      await supabase.from("documents").insert({ id: docId });

      // link conversation ↔ document
      await supabase.from("conversation_documents").insert({
        conversation_id: convId,
        document_id: docId,
      });

      // call backend ingestion
      const res = await fetch("http://localhost:5000/store-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, documentId: docId }),
      });

      const data = await res.json();
      console.log("Ingestion result:", data);

      // set active conversation + docs
      setConversationId(convId);
      setDocumentIds([docId]);

      // reset chat
      setMessages([]);
      setPrompt("");

    } catch (err) {
      console.error("handleStoreDocument error:", err);
    } finally {
      setLoading(false);
    }
  };

  /** ===============================
   * Handle user question → RAG query
   * =============================== */
  const handleSendPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !conversationId || documentIds.length === 0) return;

    const userMsg: Message = { role: "user", content: prompt };

    // add user message immediately
    setMessages(prev => [...prev, userMsg]);
    setPrompt("");
    setAnswering(true);

    try {
      const res = await fetch("http://localhost:5000/query-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userMsg.content,
          conversationId,
          documentId: documentIds[0], // single doc now
        }),
      });

      const data = await res.json();

      const aiMsg: Message = {
        role: "assistant",
        content: data.answer || "No answer returned",
      };

      setMessages(prev => [...prev, aiMsg]);

    } catch (err) {
      console.error("query error:", err);
    } finally {
      setAnswering(false);
    }
  };

  /** ===============================
   * Chat UI (after ingestion)
   * =============================== */
  if (conversationId) {
    return (
      <div className="conversation-container">
        <h2>Chat with YouTube</h2>
        <p>URL: {url}</p>

        <div className="message-container">
          {messages.map((m, i) => (
            <div key={i} className={`message ${m.role}`}>
              <div className="message-content">
                {m.content}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendPrompt} className="prompt-form">
          <Input
            placeholder="Ask a question about the document..."
            value={prompt}
            onChange={setPrompt}
          />

          <button
            type="submit"
            disabled={answering || !prompt.trim()}
            className="submit-button"
          >
            {answering ? "Thinking..." : "Send"}
          </button>
        </form>
      </div>
    );
  }

  /** ===============================
   * Ingestion UI (before chat)
   * =============================== */
  return (
    <div className="app-container">
      <h1>AI Chat with YouTube</h1>

      <form onSubmit={handleStoreDocument}>
        <Input
          placeholder="Paste a YouTube URL"
          value={url}
          onChange={setUrl}
        />

        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="submit-button"
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>

      {loading && <div className="loading-spinner">Processing video…</div>}
    </div>
  );
}

export default App;
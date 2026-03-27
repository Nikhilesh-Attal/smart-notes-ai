import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { createSupabaseClient } from "../api/api";
import { useAuth } from "../context/AuthContext";
import ChatWindow, { type Message } from "../components/ChatWindow";
import logo from "./AI_smart_Notes_Logo.png";
import "./chat.css";

export default function Chat() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const supabase = createSupabaseClient();

  // Backend State
  const [url, setUrl] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [documentIds, setDocumentIds] = useState<string[]>([]);

  // UI State
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  /* ---------------- INGEST URL ---------------- */

  const handleIngest = async (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    try {
      setIsTyping(true);

      const convId = uuidv4();
      const docId = uuidv4();
      const userId = session?.user?.id;

      await supabase.from("conversations").insert({ id: convId, user_id: userId });
      await supabase.from("documents").insert({ id: docId, user_id: userId });

      await supabase.from("conversation_documents").insert({
        conversation_id: convId,
        document_id: docId,
        user_id: userId
      });

      const res = await fetch("http://localhost:5000/store-document", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}` 
        },
        body: JSON.stringify({ url, documentId: docId }),
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.error);

      setConversationId(convId);
      setDocumentIds([docId]);

      setMessages([
        {
          role: "assistant",
          content:
            "Content processed successfully. You can now ask questions.",
        },
      ]);

      setUrl("");
    } catch (err: any) {
      console.error("Ingestion failed:", err);
      alert("Failed to process content. Make sure backend is running.");
    } finally {
      setIsTyping(false);
    }
  };

  /* ---------------- FILE UPLOAD ---------------- */

  const handleFileUpload = async (file: File) => {
    try {
      setIsTyping(true);

      const convId = uuidv4();
      const docId = uuidv4();
      const userId = session?.user?.id;

      await supabase.from("conversations").insert({ id: convId, user_id: userId });
      await supabase.from("documents").insert({ id: docId, user_id: userId });

      await supabase.from("conversation_documents").insert({
        conversation_id: convId,
        document_id: docId,
        user_id: userId
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentId", docId);

      const res = await fetch("http://localhost:5000/upload-document", {
        method: "POST",
        headers:{
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: formData,
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.error);

      setConversationId(convId);
      setDocumentIds([docId]);

      setMessages([
        {
          role: "assistant",
          content: `Successfully uploaded ${file.name}. What would you like to know?`,
        },
      ]);
    } catch (err: any) {
      console.error("Upload failed:", err);
      alert(`Failed to upload ${file.name}.`);
    } finally {
      setIsTyping(false);
    }
  };

  /* ---------------- SEND MESSAGE ---------------- */

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !conversationId) return;

    const userMsg: Message = { role: "user", content: text };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:5000/query-document", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          query: text,
          conversationId,
          documentId: documentIds[0],
        }),
      });

      // Check if response is ok
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Backend error response:", errorText);
        throw new Error(`Backend returned ${res.status}: ${errorText}`);
      }

      const data = await res.json();

      // Debug: Log the full response to see what we're getting
      console.log("Backend response:", data);
      console.log("Data.answer:", data.answer);
      console.log("Data.context:", data.context);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer || "Sorry, I couldn't find an answer.",
        },
        // Add context as a separate message for debugging
        ...(data.context ? [{
          role: "assistant" as const,
          content: `**Retrieved Context:**\n${data.context.substring(0, 1000)}${data.context.length > 1000 ? "..." : ""}`,
        }] : []),
      ]);
    } catch (err: any) {
      console.error("Query failed:", err);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error connecting to AI." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  /* ---------------- SIGN OUT ---------------- */

  const handleSignOut = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    try {
      await signOut();
      navigate("/");
    } catch (err: any) {
      console.error("Signout error", err);
    }
  };

  return (
    <div className="chat-page-container">

      {/* HEADER */}

      <header className="chat-header">
        <div
          className="logo-group"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <img src={logo} alt="logo" className="logo-image" />
          <span className="logo-text">
            Smart Notes <span className="ai-brand">AI</span>
          </span>
        </div>

        <div className="header-auth">
          <span>
            Welcome,{" "}
            {session?.user?.user_metadata?.full_name || "User"}
          </span>

          <button onClick={handleSignOut} className="btn-signout">
            Sign Out
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT */}

      <div className="chat-layout">

        {/* SIDEBAR */}

        <aside className="sidebar">
          <h2>Dashboard</h2>

          <button className="new-btn">+ New Note</button>

          <div className="history">
            <p>Machine Learning.pdf</p>
            <p>Research Paper.docx</p>
          </div>
        </aside>

        {/* CHAT SECTION */}

        <main className="chat-section">

          {/* URL INGESTION */}

          {!conversationId && (
            <form
              onSubmit={handleIngest}
              className="ingest-form"
            >
              <input
                type="text"
                placeholder="Paste YouTube URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                autoComplete="off"
              />

              <button type="submit" disabled={isTyping}>
                Process URL
              </button>
            </form>
          )}

          {/* CHAT WINDOW */}

          <div className="chat-container">
            <ChatWindow
              messages={messages}
              isTyping={isTyping}
              onSendMessage={handleSendMessage}
              onFileSelect={handleFileUpload}
              hasConversation={!!conversationId}
            />
          </div>
        </main>

      </div>
    </div>
  );
}
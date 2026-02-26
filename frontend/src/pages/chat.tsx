import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { createSupabaseClient } from "../api/api";
import { useAuth } from "../context/AuthContext";
import ChatWindow, { type Message } from "../components/ChatWindow";
import logo from "./AI_smart_Notes_Logo.png"; // Imported from teammate's UI
import "./chat.css";

export default function Chat() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const supabase = createSupabaseClient();

  // --- Backend State (From your code) ---
  const [url, setUrl] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [documentIds, setDocumentIds] = useState<string[]>([]);
  
  // --- UI State (Passed down to ChatWindow) ---
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  /** * INGESTION: Sends URL to backend, saves IDs to Supabase */
  const handleIngest = async (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    try {
      setIsTyping(true);

      const convId = uuidv4();
      const docId = uuidv4();

      await supabase.from("conversations").insert({ id: convId });
      await supabase.from("documents").insert({ id: docId });
      await supabase.from("conversation_documents").insert({
        conversation_id: convId,
        document_id: docId,
      });

      const res = await fetch("http://localhost:5000/store-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, documentId: docId }),
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.error);

      setConversationId(convId);
      setDocumentIds([docId]);
      setMessages([{ role: "assistant", content: "Content processed successfully. You can now ask questions." }]);
      setUrl("");

    } catch (err) {
      console.error("Ingestion failed:", err);
      alert("Failed to process content. Make sure backend is running.");
    } finally {
      setIsTyping(false);
    }
  };

  /** * FILE UPLOAD: Sends physical file to Python backend using FormData */
  const handleFileUpload = async (file: File) => {
    try {
      setIsTyping(true);

      const convId = uuidv4();
      const docId = uuidv4();

      await supabase.from("conversations").insert({ id: convId });
      await supabase.from("documents").insert({ id: docId, name: file.name });
      await supabase.from("conversation_documents").insert({
        conversation_id: convId,
        document_id: docId,
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentId", docId); 

      const res = await fetch("http://localhost:5000/upload-document", {
        method: "POST",
        body: formData, 
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.error);

      setConversationId(convId);
      setDocumentIds([docId]);
      setMessages([{ role: "assistant", content: `Successfully uploaded ${file.name}. What would you like to know?` }]);

    } catch (err) {
      console.error("Upload failed:", err);
      alert(`Failed to upload ${file.name}.`);
    } finally {
      setIsTyping(false);
    }
  };

  /** * QUERY: Receives text from ChatWindow, sends to backend, updates messages */
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !conversationId) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:5000/query-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: text,
          conversationId,
          documentId: documentIds[0],
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer || "Sorry, I couldn't find an answer." },
      ]);
    } catch (err) {
      console.error("Query failed:", err);
      setMessages((prev) => [...prev, { role: "assistant", content: "Error connecting to AI." }]);
    } finally {
      setIsTyping(false);
    }
  };

  /** * AUTH: Sign the user out and redirect */
  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await signOut();
      navigate("/");
    } catch (err) {
      console.error("Signout error", err);
    }
  };

  return (
    <div className="chat-page-container">
      {/* Merged Header: Teammate's UI + Your Auth Logic */}
      <header className="chat-header glass flex justify-between items-center p-4">
        <div className="logo-group flex items-center gap-2" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
          <img src={logo} alt="Smart Notes AI Logo" className="logo-image w-8 h-8" />
          <span className="logo-text font-bold">Smart Notes <span className="ai-brand text-yellow-400">AI</span></span>
        </div>
        
        <div className="header-auth flex items-center gap-4">
          <span className="text-sm font-medium">Welcome, {session?.user?.user_metadata?.full_name || "User"}</span>
          <button onClick={handleSignOut} className="btn-signout bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white text-sm">Sign Out</button>
        </div>
      </header>

      {/* Teammate's Layout Wrapper */}
      <div className="chat-layout flex h-[calc(100vh-70px)]">
        
        {/* Teammate's Sidebar UI */}
        <aside className="sidebar w-64 bg-gray-900 text-white p-4 border-r border-gray-700">
          <h2 className="text-xl font-bold mb-4">Dashboard</h2>
          <button className="new-btn w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded mb-6">+ New Note</button>
          
          <div className="history space-y-2 text-gray-300 text-sm">
            <p className="cursor-pointer hover:text-white">Machine Learning.pdf</p>
            <p className="cursor-pointer hover:text-white">Research Paper.docx</p>
          </div>
        </aside>

        {/* Your Logic Wrapper */}
        <main className="chat-section flex-1 bg-gray-800 p-6 flex flex-col">
          {/* Ingestion Input */}
          {!conversationId && (
            <form onSubmit={handleIngest} className="ingest-form mb-4 flex gap-2">
              <input 
                type="text" 
                placeholder="Paste YouTube URL to process..." 
                value={url} 
                onChange={(e) => setUrl(e.target.value)} 
                className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600"
              />
              <button type="submit" disabled={isTyping} className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded font-semibold">
                Process URL
              </button>
            </form>
          )}

          {/* Your Custom ChatWindow Component */}
          <div className="flex-1 bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
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
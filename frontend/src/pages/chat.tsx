import { useEffect, useState, type FormEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import { createSupabaseClient } from "../api/api";
import { useAuth } from "../context/AuthContext";
import ChatWindow, { type Message } from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";

export default function Chat() {
  const { session } = useAuth();
  const supabase = createSupabaseClient();

  // Sidebar & Layout State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Backend State
  const [url, setUrl] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [documentIds, setDocumentIds] = useState<string[]>([]);
  const [documentName, setDocumentName] = useState<string>("");

  // UI State
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");

  const API_BASE_URL=import.meta.env.VITE_API_URL;
      
  // Storage Persistence
  useEffect(() => {
    if (conversationId) {
      const sessionData = { conversationId, documentIds, documentName, messages };
      sessionStorage.setItem("activeChatSession", JSON.stringify(sessionData));
    }
  }, [conversationId, documentIds, documentName, messages]);

  useEffect(() => {
    const savedSession = sessionStorage.getItem("activeChatSession");
    if (savedSession) {
      const parsed = JSON.parse(savedSession);
      setConversationId(parsed.conversationId);
      setDocumentIds(parsed.documentIds);
      if (parsed.documentName) setDocumentName(parsed.documentName);
      setMessages(parsed.messages);
    }
  }, []);

  /* ---------------- HANDLERS ---------------- */

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

      const res = await fetch(`${API_BASE_URL}/store-document`, {
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
      setDocumentName(url.includes("youtube") ? "YouTube Video" : "Web Source");
      setMessages([{ role: "assistant", content: "Successfully processed the link. What should I look for?" }]);
      setUrl("");
    } catch (err: any) {
      alert("Failed to process URL.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsTyping(true);
      const convId = conversationId || uuidv4();
      const docId = uuidv4();
      const userId = session?.user?.id;

      if (!conversationId) {
        await supabase.from("conversations").insert({ id: convId, user_id: userId });
        setConversationId(convId);
      }

      await supabase.from("documents").insert({ id: docId, user_id: userId });
      await supabase.from("conversation_documents").insert({
        conversation_id: convId,
        document_id: docId,
        user_id: userId
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentId", docId);

      const res = await fetch(`${API_BASE_URL}/upload-document`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${session?.access_token}` },
        body: formData,
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.error);

      setDocumentIds((prev) => [...prev, docId]);
      setDocumentName((prev) => prev ? `${prev} + ${file.name}` : file.name);
      setMessages([{ role: "assistant", content: `Uploaded ${file.name}. Ready to chat.` }]);
    } catch (err: any) {
      alert(`Upload failed.`);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !conversationId) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const isFirstUserMessage = !messages.some(msg => msg.role === "user");
      if (isFirstUserMessage) {
        const title = `${documentName} - ${text.split(" ").slice(0, 4).join(" ")}`;
        await supabase.from("conversations").update({ title }).eq("id", conversationId);
      }

      const res = await fetch(`${API_BASE_URL}/query-document`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ query: text, conversationId, documentIds }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer || "I couldn't find an answer." }]);
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Error: Could not reach AI." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    sessionStorage.removeItem("activeChatSession");
    setConversationId(null);
    setDocumentIds([]);
    setDocumentName("");
    setMessages([]);
  };

  return (
    <div className="h-screen flex bg-brand-dark overflow-hidden font-sans">
      
      {/* SIDEBAR - Collapsible Logic */}
      <aside 
        className={`transition-all duration-300 ease-in-out border-r border-white/5 bg-[#0a0a0c] overflow-hidden ${
          isSidebarOpen ? 'w-72 opacity-100' : 'w-0 opacity-0'
        }`}
      >
        <div className="w-72 h-full"> {/* Inner wrapper prevents text wrapping during collapse */}
          <Sidebar
            setConversationId={setConversationId}
            setDocumentIds={setDocumentIds}
            setMessages={setMessages}
            onNewChat={handleNewChat}
          />
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative h-full overflow-hidden">
        
        {/* Minimalist Top Header */}
        <header className="h-14 border-b border-white/5 flex items-center px-4 bg-brand-dark/40 backdrop-blur-md z-20 shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg text-brand-muted transition-colors mr-4"
            title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <span className="text-[10px] font-black text-brand-muted/60 uppercase tracking-[0.2em] truncate">
             {conversationId ? (documentName || "Active Session") : "New Knowledge Session"}
          </span>
        </header>

        {/* MESSAGES / EMPTY STATE CONTAINER */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          <div className="flex-1 overflow-y-auto pt-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600/20 to-green-400/20 border border-white/10 mb-6 flex items-center justify-center shadow-xl">
                  <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">🧠</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Smart Notes AI</h2>
                <p className="text-brand-muted text-sm max-w-xs leading-relaxed">
                  Analyze long videos, PDFs, and web articles in seconds. Paste a link below to begin.
                </p>
              </div>
            ) : (
              <ChatWindow 
                messages={messages}
                isTyping={isTyping}
                onSendMessage={handleSendMessage}
                onFileSelect={handleFileUpload}
                hasConversation={!!conversationId}
                input={input}        
                setInput={setInput}
                hideInputWrapper={true} 
              />
            )}
          </div>

          {/* BOTTOM COMMAND CENTER (URL + Chat Input Combined) */}
          <div className="w-full max-w-4xl mx-auto px-4 pb-6">
            <div className="bg-brand-glass border border-brand-border-light rounded-[28px] p-2 shadow-2xl backdrop-blur-3xl flex flex-col gap-1.5">
              
              {/* URL Ingestion Field - Tightly integrated */}
              <form onSubmit={handleIngest} className="flex items-center gap-2 px-1">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Paste YouTube or Web link..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 bg-white/5 rounded-xl text-xs text-white border border-transparent focus:border-purple-500/30 outline-none transition-all placeholder:text-brand-muted/30"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30 text-sm">🔗</span>
                </div>
                <button 
                  disabled={isTyping || !url.trim()}
                  className="h-8 px-4 bg-brand-green/10 hover:bg-brand-green/20 text-brand-green text-[10px] font-black rounded-lg transition-all disabled:opacity-10 uppercase tracking-wider"
                >
                  Analyze
                </button>
              </form>

              {/* Main Chat Input - Visual divider used to keep it clean */}
              <div className="border-t border-white/5 pt-1.5">
                <ChatWindow 
                  messages={[]} 
                  isTyping={isTyping}
                  onSendMessage={handleSendMessage}
                  onFileSelect={handleFileUpload}
                  hasConversation={!!conversationId}
                  input={input}        
                  setInput={setInput}
                  onlyInput={true} 
                />
              </div>
            </div>
            {/* <p className="text-[9px] text-center text-brand-muted/30 mt-3 font-medium uppercase tracking-widest">
              AI-Powered Insight Engine
            </p> */}
          </div>
        </div>
      </main>
    </div>
  );
}
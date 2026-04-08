import { useEffect, useState, type FormEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import { createSupabaseClient } from "../api/api";
import { useAuth } from "../context/AuthContext";
import ChatWindow, { type Message } from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";
import { Mic, MicOff, Volume2, Globe } from "lucide-react";

export default function Chat() {
  const { session } = useAuth();
  const supabase = createSupabaseClient();

  // --- UI & Backend State ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [url, setUrl] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [documentIds, setDocumentIds] = useState<string[]>([]);
  const [documentName, setDocumentName] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");

  // --- Voice & Language State ---
  const [isListening, setIsListening] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("English"); 
  const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

  /* ---------------- PERSISTENCE ---------------- */
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

  /* ---------------- VOICE INPUT (STT) ---------------- */
  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser does not support voice recognition.");

    const recognition = new SpeechRecognition();
    recognition.lang = targetLanguage === "Hindi" ? "hi-IN" : "en-US";
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    if (isListening) recognition.stop();
    else recognition.start();
  };

  /* ---------------- VOICE OUTPUT (TTS) ---------------- */
  const speakText = (text: string) => {
    window.speechSynthesis.cancel(); 
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLanguage === "Hindi" ? "hi-IN" : "en-US";
    window.speechSynthesis.speak(utterance);
  };

  /* ---------------- HANDLERS ---------------- */

  const handleFileUpload = async (file: File) => {
    try {
      setIsTyping(true);
      let activeConvId = conversationId; 
      const docId = uuidv4();
      const userId = session?.user?.id;

      if (!activeConvId) {
        activeConvId = uuidv4();
        await supabase.from("conversations").insert({ 
          id: activeConvId, 
          user_id: userId, 
          title: file.name 
        });
        setConversationId(activeConvId);
        window.dispatchEvent(new Event("refreshHistory"));
      }

      await supabase.from("documents").insert({ id: docId, user_id: userId });
      await supabase.from("conversation_documents").insert({ 
        conversation_id: activeConvId, 
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

      if (!res.ok) throw new Error("Upload failed");

      setDocumentIds((prev) => [...prev, docId]);
      setDocumentName((prev) => prev ? `${prev} + ${file.name}` : file.name);
      setMessages((prev) => [...prev, { role: "assistant", content: `Uploaded ${file.name}.` }]);
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setIsTyping(false);
    }
  };

  /**
   * FIXED: handleIngest now accepts an optional 'passedUrl' string.
   * This ensures that when handleSendMessage detects a link, it passes it
   * directly here, avoiding the delay of React's state updates.
   */
  const handleIngest = async (e?: FormEvent, passedUrl?: string) => {
    if (e) e.preventDefault();
    
    const targetUrl = (passedUrl || url).trim();
    if (!targetUrl) return;

    try {
      setIsTyping(true);
      
      let activeConvId = conversationId;
      const newDocId = uuidv4();
      const userId = session?.user?.id;

      if (!activeConvId) {
        activeConvId = uuidv4();
        const { error: convError } = await supabase
          .from("conversations")
          .insert({ 
            id: activeConvId, 
            user_id: userId, 
            title: "Processing Source..." 
          });

        if (convError) throw convError;
        setConversationId(activeConvId);
      }

      await supabase.from("documents").insert({ id: newDocId, user_id: userId });
      await supabase.from("conversation_documents").insert({
        conversation_id: activeConvId,
        document_id: newDocId,
        user_id: userId
      });

      setMessages((prev) => [...prev, { role: "assistant", content: "Analyzing source... please wait." }]);

      const res = await fetch(`${API_BASE_URL}/store-document`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ url: targetUrl, documentId: newDocId }),
      });

      if (!res.ok) throw new Error("Backend failed to process link");

      setDocumentIds((prev) => [...prev, newDocId]);
      setDocumentName(targetUrl.includes("youtube") ? "YouTube Video" : "Web Source");
      
      setMessages((prev) => [
        ...prev, 
        { role: "assistant", content: "Source transcribed and indexed! Ask me anything about it." }
      ]);
      
      setUrl(""); 
      window.dispatchEvent(new Event("refreshHistory"));

    } catch (err: any) {
      console.error("Ingestion Error:", err);
      setMessages((prev) => [...prev, { role: "assistant", content: "❌ Failed to process the link." }]);
    } finally {
      setIsTyping(false);
    }
  };

  // --- NEW: State for Sidebar History ---
  const [conversations, setConversations] = useState<any[]>([]);

  // --- NEW: Function to fetch history from Supabase ---
  const fetchHistory = async () => {
    const userId = session?.user?.id;
    if (!userId) return;

    const { data, error } = await supabase
      .from("conversations")
      .select(`id, title, created_at, conversation_documents(document_id)`)
      .eq("user_id", userId) // Only get chats for the logged-in user
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching history:", error);
    } else {
      setConversations(data || []);
    }
  };

  // Fetch history when the component mounts or session changes
  useEffect(() => {
    if (session?.user?.id) {
      fetchHistory();
    }

    // Listen to the custom event we trigger when a new doc is uploaded/ingested
    const handleRefresh = () => fetchHistory();
    window.addEventListener("refreshHistory", handleRefresh);
    
    return () => window.removeEventListener("refreshHistory", handleRefresh);
  }, [session]);

  const handleSendMessage = async (text: string) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    // --- 1. SMART REDIRECT ---
    // If user pastes a YouTube or Web link in the chat box, redirect to ingestion
    const isLink = /^(https?:\/\/|www\.)\S+$/i.test(cleanText);
    if (isLink) {
      return handleIngest(undefined, cleanText); 
    }

    if (!conversationId) {
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Please upload a PDF or link first!" }]);
      return;
    }

    const userMsg: Message = { role: "user", content: cleanText };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // --- 2. TITLE GENERATION ---
      const isFirstMessage = messages.filter(m => m.role === 'user').length === 0;
      if (isFirstMessage) {
        const shortQuery = cleanText.split(" ").slice(0, 3).join(" ");
        const generatedTitle = `${documentName || "Note"} | ${shortQuery}...`;
        await supabase.from("conversations").update({ title: generatedTitle }).eq("id", conversationId);
        window.dispatchEvent(new Event("refreshHistory"));
      }

      // --- 3. AI QUERY ---
      const res = await fetch(`${API_BASE_URL}/query-document`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ 
          query: cleanText, 
          conversationId, 
          documentIds,
          language: targetLanguage 
        }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer || "No answer found." }]);
    } catch (err) {
      console.error("Chat Error:", err);
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
    setInput("");
    setUrl("");
  };

  return (
    <div className="h-screen flex bg-brand-dark overflow-hidden font-sans">
      
      <aside className={`transition-all duration-300 border-r border-white/5 bg-[#0a0a0c] ${isSidebarOpen ? 'w-72' : 'w-0 opacity-0'}`}>
        <Sidebar 
          setConversationId={setConversationId} 
          setDocumentIds={setDocumentIds} 
          setMessages={setMessages} 
          onNewChat={handleNewChat}
          conversations={conversations} 
          fetchHistory={fetchHistory}
          currentConversationId={conversationId} 
        />
      </aside>

      <main className="flex-1 flex flex-col relative h-full overflow-hidden">
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-4 bg-brand-dark/40 backdrop-blur-md z-20">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg text-brand-muted mr-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
            </button>
            <span className="text-[10px] font-black text-brand-muted/60 uppercase tracking-widest truncate">
              {documentName || "New Session"}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <Globe size={14} className="text-brand-green" />
            <select 
              value={targetLanguage} 
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="bg-transparent text-[10px] text-white font-bold uppercase outline-none cursor-pointer"
            >
              <option value="English" className="bg-brand-dark">English</option>
              <option value="Hindi" className="bg-brand-dark">Hindi</option>
            </select>
          </div>
        </header>

        {/* --- NEW SECTION: Dedicated URL Input Bar --- */}
        <div className="w-full max-w-4xl mx-auto px-4 pt-6 z-10">
          <form 
            onSubmit={(e) => handleIngest(e)} 
            className="flex items-center bg-[#1a1a1e] border border-white/10 rounded-2xl px-4 py-2.5 shadow-sm focus-within:border-brand-green/50 transition-colors"
          >
            <Globe size={18} className="text-brand-subtle mr-3 flex-shrink-0" />
            <input
              type="url"
              placeholder="Paste YouTube or Web URL here to analyze..."
              className="flex-1 bg-transparent border-none text-sm text-white placeholder-brand-subtle focus:outline-none w-full"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isTyping}
            />
            <button 
              type="submit" 
              disabled={!url.trim() || isTyping}
              className="ml-3 px-4 py-1.5 bg-brand-green/10 hover:bg-brand-green/20 text-brand-green text-xs font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTyping ? "Loading..." : "Process Link"}
            </button>
          </form>
        </div>

        <div className="flex-1 overflow-y-auto pt-4">
          <ChatWindow messages={messages} isTyping={isTyping} onSendMessage={handleSendMessage} onFileSelect={handleFileUpload} hasConversation={!!conversationId} input={input} setInput={setInput} hideInputWrapper={true} />
        </div>

        <div className="w-full max-w-4xl mx-auto px-4 pb-6">
          <div className="bg-brand-glass border border-brand-border-light rounded-[28px] p-3 shadow-2xl backdrop-blur-3xl">
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleListening}
                className={`p-3 rounded-full transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-white/5 hover:bg-white/10 text-brand-muted'}`}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              <div className="flex-1">
                <ChatWindow 
                  messages={[]} 
                  isTyping={isTyping} 
                  onSendMessage={handleSendMessage} 
                  onFileSelect={handleFileUpload} 
                  hasConversation={!!conversationId} 
                  input={input} setInput={setInput} onlyInput={true} 
                />
              </div>

              <button 
                onClick={() => messages.length > 0 && speakText(messages[messages.length - 1].content)}
                className="p-3 bg-brand-green/10 hover:bg-brand-green/20 text-brand-green rounded-full transition-all"
                title="Listen to last response"
              >
                <Volume2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
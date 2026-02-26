import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { createSupabaseClient } from "../api/api";
import { useAuth } from "../context/AuthContext";
import ChatWindow, { type Message } from "../components/ChatWindow"; // Import our updated component
import "./chat.css";

export default function Chat() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const supabase = createSupabaseClient();

  // --- Backend State ---
  const [url, setUrl] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [documentIds, setDocumentIds] = useState<string[]>([]);
  
  // --- UI State (Passed down to ChatWindow) ---
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  /** * INGESTION: Sends URL/File to backend, saves IDs to Supabase
   */
  const handleIngest = async (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    try {
      setIsTyping(true); // Show loading state

      const convId = uuidv4();
      const docId = uuidv4();

      // Save to Supabase
      await supabase.from("conversations").insert({ id: convId });
      await supabase.from("documents").insert({ id: docId });
      await supabase.from("conversation_documents").insert({
        conversation_id: convId,
        document_id: docId,
      });

      // Send to local Python backend
      const res = await fetch("http://localhost:5000/store-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, documentId: docId }),
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.error);

      // Setup the session
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

  // Add this inside your Chat component in pages/chat.tsx, right below handleIngest
// Don't forget to pass it to the <ChatWindow /> at the bottom!

  /** * FILE UPLOAD: Sends physical file to Python backend using FormData
   */
  const handleFileUpload = async (file: File) => {
    try {
      setIsTyping(true); // Show the loading animation

      const convId = uuidv4();
      const docId = uuidv4();

      // 1. Save reference to Supabase
      await supabase.from("conversations").insert({ id: convId });
      await supabase.from("documents").insert({ id: docId, name: file.name });
      await supabase.from("conversation_documents").insert({
        conversation_id: convId,
        document_id: docId,
      });

      // 2. Prepare the file for the backend (Crucial step!)
      const formData = new FormData();
      formData.append("file", file); // Attach the actual PDF/Document
      formData.append("documentId", docId); 
      // Note: You do NOT use JSON.stringify for files!

      // 3. Send to Python backend
      // Make sure your Python route (e.g., /upload-document) accepts files
      const res = await fetch("http://localhost:5000/upload-document", {
        method: "POST",
        // Note: Do NOT set "Content-Type" manually here. 
        // The browser automatically sets it to "multipart/form-data" when it sees FormData.
        body: formData, 
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.error);

      // 4. Update UI
      setConversationId(convId);
      setDocumentIds([docId]);
      setMessages([{ role: "assistant", content: `Successfully uploaded and processed ${file.name}. What would you like to know?` }]);

    } catch (err) {
      console.error("Upload failed:", err);
      alert(`Failed to upload ${file.name}.`);
    } finally {
      setIsTyping(false);
    }
  };

  /** * QUERY: Receives text from ChatWindow, sends to backend, updates messages
   */
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !conversationId) return;

    // 1. Immediately show user's message in UI
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true); // 2. Turn on the typing dots in ChatWindow

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

      // 3. Add the real AI response to the UI
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer || "Sorry, I couldn't find an answer." },
      ]);
    } catch (err) {
      console.error("Query failed:", err);
      setMessages((prev) => [...prev, { role: "assistant", content: "Error connecting to AI." }]);
    } finally {
      setIsTyping(false); // 4. Turn off typing dots
    }
  };

  /**
   * AUTH: Sign the user out and redirect
   */
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
      <header className="chat-header flex justify-between items-center p-4">
        {/* Note: Supabase stores custom data like 'full_name' inside user_metadata */}
        <h3>Welcome, {session?.user?.user_metadata?.full_name || "User"}</h3>
        <button onClick={handleSignOut} className="btn-signout">Sign Out</button>
      </header>

      <main className="chat-section">
        {/* Temporary Input for testing ingestion until FileUpload is wired up */}
        {!conversationId && (
          <form onSubmit={handleIngest} className="ingest-form mb-4">
            <input 
              type="text" 
              placeholder="Paste URL to process..." 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
            />
            <button type="submit" disabled={isTyping}>Process</button>
          </form>
        )}

        {/* Here we inject our visual ChatWindow component, passing it exactly the 
          data and functions it needs to work properly! 
        */}
        <ChatWindow 
          messages={messages} 
          isTyping={isTyping} 
          onSendMessage={handleSendMessage}
          onFileSelect={handleFileUpload}
          hasConversation={!!conversationId} 
        />
      </main>
    </div>
  );
}
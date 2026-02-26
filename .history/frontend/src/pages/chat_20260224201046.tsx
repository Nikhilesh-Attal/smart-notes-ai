// import { useState, useRef, useEffect } from "react";
// import "./chat.css";

// interface Message {
//   role: "user" | "assistant";
//   content: string;
// }

// function Chat() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const [file, setFile] = useState<File | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

//   // Auto scroll
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSend = () => {
//     if (!input.trim() && !file) return;

//     if (input.trim()) {
//       const userMessage: Message = { role: "user", content: input };
//       setMessages((prev) => [...prev, userMessage]);
//     }

//     if (file) {
//       const fileMessage: Message = {
//         role: "user",
//         content: `📄 Uploaded: ${file.name}`,
//       };
//       setMessages((prev) => [...prev, fileMessage]);
//       setFile(null);
//     }

//     setInput("");

//     // Fake AI response
//     setTimeout(() => {
//       setMessages((prev) => [
//         ...prev,
//         { role: "assistant", content: "Generating smart notes..." },
//       ]);
//     }, 1000);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       handleSend();
//     }
//   };

//   return (
//     <div className="chat-layout">
//       {/* Sidebar */}
//       <div className="sidebar">
//         <h2>Smart Notes AI</h2>
//         <button className="new-btn">+ New Note</button>

//         <div className="history">
//           <p>Machine Learning.pdf</p>
//           <p>Research Paper.docx</p>
//         </div>
//       </div>

//       {/* Chat Section */}
//       <div className="chat-section">
//         <div className="chat-messages">
//           {messages.map((msg, index) => (
//             <div
//               key={index}
//               className={`chat-bubble ${
//                 msg.role === "user" ? "user" : "assistant"
//               }`}
//             >
//               {msg.content}
//             </div>
//           ))}
//           <div ref={messagesEndRef}></div>
//         </div>

//         {/* Bottom Input */}
//         <div className="chat-input">
//           <input
//             type="file"
//             accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
//             onChange={(e) => setFile(e.target.files?.[0] || null)}
//           />

//           <input
//             type="text"
//             placeholder="Upload file or ask something..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKeyPress}
//           />

//           <button onClick={handleSend}>Send</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Chat;

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./chat.css";

interface Message {
  role: "user" | "assistant";
  content: string;
  isLink?: boolean;
}

function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! Upload a document or image, and I'll generate smart notes for you. ✨" }
  ]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() && !file) return;

    let userText = input;
    if (file) {
      userText = `📄 ${file.name}\n${input}`;
    }

    const userMessage: Message = { role: "user", content: userText };
    setMessages((prev) => [...prev, userMessage]);
    
    // Reset inputs
    setInput("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    // Fake AI Logic
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Analysis complete. I've extracted the key concepts and organized them into your dashboard." },
      ]);
    }, 1500);
  };

  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <aside className="sidebar glass">
        <div className="sidebar-header" onClick={() => navigate("/")}>
          <span className="logo-text">Smart <span className="ai-brand">Notes</span></span>
        </div>
        
        <button className="new-chat-pill">+ New Session</button>

        <div className="history-section">
          <label>Recent Analyses</label>
          <div className="history-item">Machine Learning.pdf</div>
          <div className="history-item">Q3 Report.docx</div>
          <div className="history-item">Biology_Diagram.png</div>
        </div>

        <div className="sidebar-footer">
          <button className="logout-link" onClick={() => navigate("/")}>Back to Home</button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="chat-main">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message-wrapper ${msg.role}`}>
              <div className={`chat-bubble ${msg.role}`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Input Dock */}
        <div className="input-dock-container">
          <div className="input-dock glass">
            <button className="attach-btn" onClick={() => fileInputRef.current?.click()}>
              {file ? "✅" : "📎"}
            </button>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              hidden 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            <input
              type="text"
              placeholder="Ask AI to summarize or explain..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />

            <button className="send-pill" onClick={handleSend}>
              Generate
            </button>
          </div>
          {file && <span className="file-preview">Ready to upload: {file.name}</span>}
        </div>
      </main>
    </div>
  );
}

export default Chat;
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
import logo from "./AI_smart_Notes_Logo.png"; 
import "./chat.css";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() && !file) return;

    if (input.trim()) {
      setMessages((prev) => [...prev, { role: "user", content: input }]);
    }

    if (file) {
      setMessages((prev) => [...prev, { role: "user", content: `📄 Uploaded: ${file.name}` }]);
      setFile(null);
    }

    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: "Generating smart notes..." }]);
    }, 1000);
  };

  return (
    <div className="chat-page-container">
      {/* Header Section */}
      <header className="chat-header glass">
        <div className="logo-group" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
          <img src={logo} alt="Smart Notes AI Logo" className="logo-image" />
          <span className="logo-text">Smart Notes <span className="ai-brand">AI</span></span>
        </div>
        
        <div className="header-auth">
          <div className="auth-pill">
            <button className="auth-btn" onClick={() => navigate("/login")}>Login</button>
            <div className="auth-divider"></div>
            <button className="auth-btn" onClick={() => navigate("/signup")}>Signup</button>
          </div>
        </div>
      </header>

      <div className="chat-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <h2>Dashboard</h2>
          <button className="new-btn">+ New Note</button>
          <div className="history">
            <p>Machine Learning.pdf</p>
            <p>Research Paper.docx</p>
          </div>
        </aside>

        {/* Chat Section */}
        <main className="chat-section">
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-bubble ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>

          <div className="chat-input-container">
            <div className="chat-input glass">
              <input
                type="file"
                id="file-upload"
                hidden
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <label htmlFor="file-upload" className="file-label">
                {file ? "✅" : "📎"}
              </label>

              <input
                type="text"
                placeholder="Ask something..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button className="send-btn" onClick={handleSend}>Send</button>
            </div>
            {file && <span className="file-name-preview">{file.name}</span>}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Chat;

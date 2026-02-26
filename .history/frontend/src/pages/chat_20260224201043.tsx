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


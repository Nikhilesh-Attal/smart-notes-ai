import { useState, useRef, useEffect } from "react";
import FileUpload from "./FileUpload";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatWindowProps {
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (text: string) => void;
  onFileSelect: (file: File) => void;
  hasConversation: boolean;
}

const ChatWindow = ({
  messages,
  isTyping,
  onSendMessage,
  onFileSelect,
  hasConversation,
}: ChatWindowProps) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendClick = () => {
    if (!input.trim()) return;

    onSendMessage(input);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSendClick();
  };

  return (
    <div className="chat-window">

      {/* Messages Area */}
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role === "user" ? "user" : "bot"}`}
          >
            {msg.content}
          </div>
        ))}

        {isTyping && (
          <div className="message bot">
            <span className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Bar */}
      <div className="chat-bottom">
        {/* Upload Button */}
        <FileUpload onFileSelect={onFileSelect} disabled={isTyping} />
        {/* Input */}
        <input
          type="text"
          placeholder="Ask about your document..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          autoComplete="off"
          disabled={!hasConversation}
        />

        {/* Send Button */}
        <button onClick={handleSendClick} disabled={!hasConversation}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;

// import { useState, useRef, useEffect } from "react";
// import FileUpload from "./FileUpload";
// //import "../styles/chat.css";

// // 1. Define exact structure of a message so TypeScript is happy
// export interface Message {
//   role: "user" | "assistant";
//   content: string;
// }

// // 2. Define "Props" (data and functions) this component expects to receive from Parent
// interface ChatWindowProps {
//   messages: Message[];
//   isTyping: boolean;
//   onSendMessage: (text: string) => void;
//   onFileSelect: (file: File) => void;
//   hasConversation: boolean; // Used to hide input box if no document/video is uploaded yet
// }

// const ChatWindow = ({ messages, isTyping, onSendMessage, onFileSelect, hasConversation }: ChatWindowProps) => {
//   const [input, setInput] = useState("");
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

//   // Auto-scroll to bottom whenever 'messages' array changes
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Handle when user clicks "Send" or presses Enter
//   const handleSendClick = () => {
//     if (!input.trim()) return;
    
//     // Pass text BACK to parent component (chat.tsx) to handle backend fetch
//     onSendMessage(input); 
//     setInput(""); // Clear input field
//   };

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") handleSendClick();
//   };

//   return (
//     <div className="chat-container">
//       <div className="chat-messages">
//         {/* 3. Loop through actual messages provided by Parent */}
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             // Dynamically assign CSS classes based on who sent message
//             className={`message ${msg.role === "user" ? "user" : "bot"}`}
//           >
//             {msg.content}
//           </div>
//         ))}

//         {/* 4. Show typing animation only when Parent says 'isTyping' is true */}
//         {isTyping && (
//           <div className="message bot">
//             <span className="typing-dots">
//               <span></span><span></span><span></span>
//             </span>
//           </div>
//         )}

//         {/* Invisible div to help us auto-scroll to bottom */}
//         <div ref={messagesEndRef} />
//       </div>

//       <FileUpload onFileSelect={onFileSelect} disabled={isTyping}/>

//       {/* 5. Only show input area if a conversation has been started via ingestion */}
//       {hasConversation && (
//         <div className="chat-input">
//           <input
//             type="text"
//             id="chat-message-input"
//             name="chat-message"
//             placeholder="Ask about your document..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKeyPress}
//             autoComplete="off"
//           />
//           <button onClick={handleSendClick}>Send</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatWindow;
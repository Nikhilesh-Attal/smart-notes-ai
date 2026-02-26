import { useState, useRef, useEffect } from "react";
import FileUpload from "./FileUpload";
import "../styles/chat.css";

// 1. Define the exact structure of a message so TypeScript is happy
export interface Message {
  role: "user" | "assistant";
  content: string;
}

// 2. Define the "Props" (data and functions) this component expects to receive from the Parent
interface ChatWindowProps {
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (text: string) => void;
  onFileSelect: (file: File) => void;
  hasConversation: boolean; // Used to hide the input box if no document/video is uploaded yet
}

const ChatWindow = ({ messages, isTyping, onSendMessage, onFileSelect, hasConversation }: ChatWindowProps) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to the bottom whenever the 'messages' array changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle when the user clicks "Send" or presses Enter
  const handleSendClick = () => {
    if (!input.trim()) return;
    
    // Pass the text BACK to the parent component (chat.tsx) to handle the backend fetch
    onSendMessage(input); 
    setInput(""); // Clear the input field
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSendClick();
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {/* 3. Loop through the actual messages provided by the Parent */}
        {messages.map((msg, index) => (
          <div
            key={index}
            // Dynamically assign CSS classes based on who sent the message
            className={`message ${msg.role === "user" ? "user" : "bot"}`}
          >
            {msg.content}
          </div>
        ))}

        {/* 4. Show the typing animation only when the Parent says 'isTyping' is true */}
        {isTyping && (
          <div className="message bot">
            <span className="typing-dots">
              <span></span><span></span><span></span>
            </span>
          </div>
        )}

        {/* Invisible div to help us auto-scroll to the bottom */}
        <div ref={messagesEndRef} />
      </div>

      <FileUpload onFileSelect={onFileSelect} disabled={isTyping}/>

      {/* 5. Only show the input area if a conversation has been started via ingestion */}
      {hasConversation && (
        <div className="chat-input">
          <input
            type="text"
            placeholder="Ask about your document..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button onClick={handleSendClick}>Send</button>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
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

      <div className="chat-bottom">
        <FileUpload onFileSelect={onFileSelect} disabled={isTyping} />

        <input
          type="text"
          placeholder="Ask about your document..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          autoComplete="off"
          disabled={!hasConversation}
        />

        <button onClick={handleSendClick} disabled={!hasConversation}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
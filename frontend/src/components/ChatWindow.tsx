import { useState, useRef, useEffect } from "react";
import FileUpload from "./FileUpload";
import "../styles/chat.css";

<<<<<<< HEAD
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
=======
interface Message {
  text: string;
  sender: "user" | "bot";
}

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to latest message
>>>>>>> 93fe1ef398e2d753a267bb1a0b001e4b4daf0f27
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

<<<<<<< HEAD
  // Handle when the user clicks "Send" or presses Enter
  const handleSendClick = () => {
    if (!input.trim()) return;
    
    // Pass the text BACK to the parent component (chat.tsx) to handle the backend fetch
    onSendMessage(input); 
    setInput(""); // Clear the input field
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSendClick();
=======
  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage: Message = { text: input, sender: "user" };

    // Use functional update to prevent overwrite bug
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);

    // Simulated AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "AI is generating smart notes for your content...", sender: "bot" },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
>>>>>>> 93fe1ef398e2d753a267bb1a0b001e4b4daf0f27
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
<<<<<<< HEAD
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
=======
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === "user" ? "user" : "bot"}`}
          >
            {msg.text}
          </div>
        ))}

        {isTyping && (
          <div className="message bot">
            <span className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
>>>>>>> 93fe1ef398e2d753a267bb1a0b001e4b4daf0f27
            </span>
          </div>
        )}

<<<<<<< HEAD
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
=======
        <div ref={messagesEndRef} />
      </div>

      <FileUpload />

      <div className="chat-input">
        <input
          type="text"
          placeholder="Upload file or type your request..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
>>>>>>> 93fe1ef398e2d753a267bb1a0b001e4b4daf0f27
    </div>
  );
};

export default ChatWindow;
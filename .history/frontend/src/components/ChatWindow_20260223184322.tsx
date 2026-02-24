import { useState } from "react";
import FileUpload from "./FileUpload";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input) return;

    const newMessage: Message = { text: input, sender: "user" };
    setMessages([...messages, newMessage]);

    // Fake bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "AI is generating notes...", sender: "bot" },
      ]);
    }, 800);

    setInput("");
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === "user" ? "user" : "bot"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <FileUpload />

      <div className="chat-input">
        <input
          type="text"
          placeholder="Upload file or type your request..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
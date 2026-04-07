import { useRef, useEffect } from "react";
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
  input: string;                 
  setInput: (val: string) => void;
  hideInputWrapper?: boolean;
  onlyInput?: boolean;
}

const ChatWindow = ({
  messages,
  isTyping,
  onSendMessage,
  onFileSelect,
  hasConversation,
  input,
  setInput, hideInputWrapper = false, onlyInput = false
}: ChatWindowProps) => {
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

  //if onlyInput is true, only render the bottom input dock
  if(onlyInput){
    return(
      <div className="flex items-center gap-3 w-full">
        <FileUpload onFileSelect={onFileSelect} disabled={isTyping} />

        <input type="text" placeholder="Ask about your document..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyPress} autoComplete="off" disabled={!hasConversation} className="flex-1 py-2.5 px-5 rounded-xl border border-white/10 bg-black/20 text-white text-sm placeholder-brand-subtle outline-none focus:border-brand-green/50 transition-colors duration-200 disabled:opacity-50" />
        <button onClick={handleSendClick} disabled={!hasConversation} className="px-5 py-2.5 bg-brand-green hover:bg-brand-green-hover text-brand-dark text-sm font-bold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-brand-green/10"
        >Send</button>
      </div>
    );
  }

  return (
    // <div className="flex flex-col h-full">
    <div className="flex flex-col h-full overflow-hidden">
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-[15%] py-10 flex flex-col gap-4 min-h-0">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[70%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${msg.role === "user"
                ? "bg-brand-green text-brand-dark self-end rounded-br-sm font-medium"
                : "bg-brand-glass border border-brand-border-light text-brand-text self-start rounded-bl-sm"
              }`}
          >
            {msg.content}
          </div>
        ))}

        {isTyping && (
          <div className="bg-brand-glass border border-brand-border-light text-brand-text self-start max-w-[70%] px-5 py-3.5 rounded-2xl rounded-bl-sm">
            <span className="animate-typing flex gap-1">
              <span className="w-1.5 h-1.5 bg-brand-muted rounded-full inline-block"></span>
              <span className="w-1.5 h-1.5 bg-brand-muted rounded-full inline-block"></span>
              <span className="w-1.5 h-1.5 bg-brand-muted rounded-full inline-block"></span>
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* render the old input dock only if hideInputWrapper is false */}
      {!hideInputWrapper && (

      <div className="flex items-center gap-3 px-[15%] py-5 bg-brand-dark border-t border-brand-border">
        <FileUpload onFileSelect={onFileSelect} disabled={isTyping} />

        <input
          type="text"
          placeholder="Ask about your document..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          autoComplete="off"
          disabled={!hasConversation}
          className="flex-1 px-5 py-3 rounded-full border border-brand-border-light bg-brand-glass text-white placeholder-brand-subtle outline-none focus:border-brand-green transition-colors duration-200 disabled:opacity-50"
        />

        <button
          onClick={handleSendClick}
          disabled={!hasConversation}
          className="px-6 py-3 bg-brand-green hover:bg-brand-green-hover text-brand-dark font-bold rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:-translate-y-0.5 shadow-lg shadow-brand-green/20"
        >
          Send
        </button>
      </div>
      )}
    </div> 
  );
};

export default ChatWindow;
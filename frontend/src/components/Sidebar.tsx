import { createSupabaseClient } from "../api/api";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEllipsisVertical, 
  faMessage, 
  faPen, 
  faTrash 
} from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";

export default function Sidebar({
  setConversationId,
  setDocumentIds,
  setMessages,
  onNewChat,
  conversations = [],
  fetchHistory,
  currentConversationId, // Pass this from Chat.tsx to highlight the active chat
}: any) {
  const supabase = createSupabaseClient();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  // Local state for optimistic UI updates (instant frontend changes)
  const [localConversations, setLocalConversations] = useState<any[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync prop conversations to local state
  useEffect(() => {
    setLocalConversations(conversations);
  }, [conversations]);

  // Initial fetch on mount
  useEffect(() => {
    if (fetchHistory) fetchHistory();
  }, []);

  // Close 3-dot menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Logic Functions ---

  const handleSelect = async (conv: any) => {
    const docIds = conv.conversation_documents?.map((d: any) => d.document_id) || [];
    setConversationId(conv.id);
    setDocumentIds(docIds);

    const { data } = await supabase
      .from("conversation_messages")
      .select("*")
      .eq("conversation_id", conv.id)
      .order("created_at");

    setMessages(data || []);
  };

  const handleCreateChat = async () => {
    // 1. Clear current screen
    if (onNewChat) onNewChat();

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) return;

      const newConvId = uuidv4();
      const defaultTitle = "New Chat";

      // 2. Optimistic UI update
      const newChatObj = { id: newConvId, title: defaultTitle, created_at: new Date().toISOString() };
      setLocalConversations((prev) => [newChatObj, ...prev]);

      // 3. Auto-save to Supabase directly from frontend
      const { error } = await supabase
        .from("conversations")
        .insert({ id: newConvId, user_id: userId, title: defaultTitle });

      if (error) throw error;

      // 4. Set as active
      setConversationId(newConvId);
      setDocumentIds([]);
      setMessages([]);
      
      if (fetchHistory) fetchHistory(); // Sync backend state silently
    } catch (error) {
      console.error("Failed to auto-create chat:", error);
    }
  };

  const handleRename = async (e: React.MouseEvent, convId: string, currentTitle: string) => {
    e.stopPropagation();
    setActiveMenu(null);
    
    const newTitle = prompt("Enter new chat name:", currentTitle);
    if (!newTitle || newTitle.trim() === currentTitle) return;

    // Optimistic UI Update (Instant frontend change)
    setLocalConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, title: newTitle } : c))
    );

    // Direct frontend-to-database update (No backend API needed)
    const { error } = await supabase
      .from("conversations")
      .update({ title: newTitle })
      .eq("id", convId);

    if (error) {
      console.error("Rename error:", error);
      if (fetchHistory) fetchHistory(); // Revert on failure
    }
  };

  const handleDelete = async (e: React.MouseEvent, convId: string) => {
    e.stopPropagation();
    setActiveMenu(null);

    const confirmDelete = confirm("Delete this chat and its documents?");
    if (!confirmDelete) return;

    // Optimistic UI Update (Instant frontend change)
    setLocalConversations((prev) => prev.filter((c) => c.id !== convId));
    
    // Clear chat window if active chat is deleted
    if (currentConversationId === convId && onNewChat) {
      onNewChat();
    }

    // Direct frontend-to-database deletion (No backend API needed)
    const { error } = await supabase
      .from("conversations")
      .delete()
      .eq("id", convId);

    if (error) {
      console.error("Delete error:", error);
      alert("Failed to delete chat. Please try again.");
      if (fetchHistory) fetchHistory(); // Revert on failure
    }
  };

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenu((prev) => (prev === id ? null : id));
  };

  return (
    <aside className="w-64 bg-brand-darker flex flex-col border-r border-brand-border p-4 h-screen">
      
      {/* Auto-Create Chat Button */}
      <button
        className="w-full py-3 px-4 bg-brand-green hover:bg-brand-green-hover text-brand-dark font-bold rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-brand-green/20 mb-6 flex items-center justify-center gap-2 cursor-pointer"
        onClick={handleCreateChat}
      >
        <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
        New Note
      </button>

      <h2 className="text-xs uppercase tracking-widest text-brand-subtle mb-3 px-2 font-semibold">
        Recent
      </h2>

      {/* Chat History List */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar" ref={menuRef}>
        {localConversations?.map((conv: any) => {
          const isActive = currentConversationId === conv.id;

          return (
            <div
              key={conv.id}
              onClick={() => handleSelect(conv)}
              className={`group flex items-center justify-between rounded-lg px-3 py-2.5 cursor-pointer transition-all duration-200 relative ${
                isActive ? "bg-white/10 text-white" : "hover:bg-brand-glass-hover text-brand-muted"
              }`}
            >
              {/* Icon & Title Section */}
              <div className="flex-1 min-w-0 flex items-center gap-3">
                <FontAwesomeIcon 
                  icon={faMessage} 
                  className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? "text-brand-green" : "text-brand-subtle group-hover:text-brand-muted"}`} 
                />
                <p className={`truncate text-sm ${isActive ? "font-medium" : "group-hover:text-brand-green-light transition-colors"}`}>
                  {conv.title || "New Chat"}
                </p>
              </div>

              {/* Three Dot Menu Container */}
              <div className="relative flex-shrink-0 ml-2">
                <button
                  onClick={(e) => toggleMenu(e, conv.id)}
                  className={`p-1 rounded-md transition-all duration-200 ${
                    activeMenu === conv.id || isActive
                      ? "opacity-100 text-white hover:bg-white/10"
                      : "opacity-0 group-hover:opacity-100 text-brand-subtle hover:text-white hover:bg-white/10"
                  }`}
                >
                  <FontAwesomeIcon icon={faEllipsisVertical} className="w-3.5 h-3.5 px-1" />
                </button>

                {/* Dropdown Menu */}
                {activeMenu === conv.id && (
                  <div className="absolute right-0 top-full mt-1 bg-[#1a1a1e] border border-brand-border-light rounded-lg shadow-2xl z-50 overflow-hidden w-32 py-1">
                    <button
                      onClick={(e) => handleRename(e, conv.id, conv.title)}
                      className="w-full text-left px-3 py-2 text-sm text-brand-muted hover:text-white hover:bg-white/10 flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faPen} className="w-3 h-3" />
                      Rename
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, conv.id)}
                      className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
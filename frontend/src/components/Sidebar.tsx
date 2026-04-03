import { Link } from "react-router-dom";
import { createSupabaseClient } from "../api/api";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar({
  setConversationId,
  setDocumentIds,
  setMessages,
  onNewChat,
}: any) {
  const supabase = createSupabaseClient();

  const [conversations, setConversations] = useState<any[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from("conversations")
      .select(
        `id, title, conversation_documents(document_id)`
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setConversations(data || []);
  };

  const handleSelect = async (conv: any) => {
    const docIds =
      conv.conversation_documents?.map(
        (d: any) => d.document_id
      ) || [];

    setConversationId(conv.id);
    setDocumentIds(docIds);

    const { data } = await supabase
      .from("conversation_messages")
      .select("*")
      .eq("conversation_id", conv.id)
      .order("created_at");

    setMessages(data || []);
  };

  const handleRename = async (convId: string) => {
    const newTitle = prompt("Enter new chat name:");
    if (!newTitle) return;

    const { error } = await supabase
      .from("conversations")
      .update({ title: newTitle })
      .eq("id", convId);

    if (error) console.error(error);

    fetchHistory();
    setActiveMenu(null);
  };

  const handleDelete = async (convId: string) => {
    const confirmDelete = confirm("Delete this chat and its documents?");
    if (!confirmDelete) {
      setActiveMenu(null);
      return;
    }

    setConversations((prev) =>
      prev.filter((c) => c.id !== convId)
    );

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) throw new Error("Unauthorized person try to delete chat");

      const reponse = await fetch(`http://localhost:5000/delete/conversation/${convId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!reponse.ok) {
        throw new Error("Failed to delete chat");
      }
    } catch (error) {
      console.error(error);
      fetchHistory();
    }
  };

  const toggleMenu = (id: string) => {
    setActiveMenu((prev) => (prev === id ? null : id));
  };

  return (
    <aside className="w-64 bg-brand-darker flex flex-col border-r border-brand-border p-6">
      <h2 className="text-xs uppercase tracking-widest text-brand-subtle mb-5 font-semibold">Dashboard</h2>

      <button
        className="w-full py-3 bg-brand-green hover:bg-brand-green-hover text-brand-dark font-bold rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-brand-green/20 mb-6 cursor-pointer"
        onClick={onNewChat}
      >
        + New Note
      </button>

      <div className="flex-1 overflow-y-auto space-y-1">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className="group flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-brand-glass-hover transition-all duration-200 relative"
          >
            <div
              onClick={() => handleSelect(conv)}
              className="flex-1 text-sm text-brand-muted hover:text-brand-green-light cursor-pointer truncate mr-2 transition-colors duration-200"
            >
              {conv.title || "New Chat"}
            </div>

            {/* Three dot menu */}
            <div className="relative">
              <span
                onClick={() => toggleMenu(conv.id)}
                className="text-brand-subtle hover:text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1"
              >
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </span>

              {activeMenu === conv.id && (
                <div className="absolute right-0 top-7 bg-brand-card border border-brand-border-light rounded-lg shadow-xl z-20 overflow-hidden min-w-[120px]">
                  <div
                    onClick={() => handleRename(conv.id)}
                    className="px-4 py-2.5 text-sm text-brand-muted hover:text-white hover:bg-brand-glass-hover cursor-pointer transition-all duration-200"
                  >
                    Rename
                  </div>
                  <div
                    onClick={() => handleDelete(conv.id)}
                    className="px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-brand-glass-hover cursor-pointer transition-all duration-200"
                  >
                    Delete
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
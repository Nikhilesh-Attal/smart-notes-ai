import { Link } from "react-router-dom";
import { createSupabaseClient } from "../api/api";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar({
  setConversationId,
  setDocumentIds,
  setMessages,
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

  const handleNewChat = () => {
    setConversationId(null);
    setDocumentIds([]);
    setMessages([]);
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
    const confirmDelete = confirm("Delete this chat?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("conversations")
      .delete()
      .eq("id", convId);

    if (error) console.error(error);

    fetchHistory();
  };

  const toggleMenu = (id: string) => {
    setActiveMenu((prev) => (prev === id ? null : id));
  };

  return (
    <aside className="sidebar">
      <h2>Dashboard</h2>

      <button className="new-btn" onClick={handleNewChat}>
        New Note
      </button>

      <div className="history">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
              position: "relative",
            }}
          >
            <div
              onClick={() => handleSelect(conv)}
              style={{ cursor: "pointer" }}
            >
              {conv.title || "New Chat"}
            </div>

            {/* Three dot menu */}
            <div style={{ cursor: "pointer" }}>
              <span onClick={() => toggleMenu(conv.id)}>
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </span>

              {activeMenu === conv.id && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "25px",
                    background: "white",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    padding: "5px",
                    zIndex: 10,
                  }}
                >
                  <div
                    onClick={() => handleRename(conv.id)}
                    style={{ padding: "5px", cursor: "pointer" }}
                  >
                    Rename
                  </div>
                  <div
                    onClick={() => handleDelete(conv.id)}
                    style={{ padding: "5px", cursor: "pointer" }}
                  >
                    Delete
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div
        className="sidebar-footer"
        style={{
          marginTop: "auto",
          borderTop: "1px solid black",
          paddingTop: "15px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Link to="/">Home</Link>
        <Link to="/about">About Us</Link>
      </div>
    </aside>
  );
}
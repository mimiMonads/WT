// Board.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";   // NEW
import "./index.scss";
import { HOST } from "../../links";

export default function Board() {
  const { id: to } = useParams();              // <-- recipient Id from URL
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState("");        // renamed for validator
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // GET helper ― conversation-scoped (optionally searched)
  const loadMessages = async (q = "") => {
    try {
      // feel free to adjust the endpoint if you later add a dedicated
      // “conversation” route on the backend ― this still works with the
      // generic list + client-side filter for now.
      const url = `${HOST}/api/messages`;
      const res  = await fetch(url, { credentials: "include" });
      const data = await res.json();
      const filtered = Array.isArray(data)
        ? data
            .filter((m) => m.to === to || m.from === to) // keep the thread
            .filter((m) =>
              q ? (m.body || m.content || "").toLowerCase().includes(q.toLowerCase()) : true
            )
            .reverse()
        : [];
      setMessages(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  // initial + when URL param changes
  useEffect(() => {
    if (to) loadMessages();
  }, [to]);

  // POST /api/messages
  const submit = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`${HOST}/api/messages`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, to }),     // <-- matches validator
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setBody("");
      loadMessages();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const searchSubmit = (e) => {
    e.preventDefault();
    loadMessages(search.trim());
  };

  return (
    <div className="board-page">
      <header>
        <h1>Messages with {to}</h1> {/* simple context for the user */}
        <form onSubmit={searchSubmit} className="search-form">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search this chat..."
          />
          <button>Search</button>
        </form>
      </header>

      <form onSubmit={submit} className="board-form">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your message..."
        />
        {error && <div className="error-message">{error}</div>}
        <button disabled={busy} className="flat-button">
          {busy ? "Sending…" : "Send"}
        </button>
      </form>

      <ul className="message-list">
        {messages.map((m) => (
          <li key={m._id} className="message-item">
            <p>{m.body || m.content}</p>
            <span className="meta">
              {new Date(m.createdAt || m.date || Date.now()).toLocaleString()}
            </span>
          </li>
        ))}
        {messages.length === 0 && <p>No messages yet.</p>}
      </ul>
    </div>
  );
}

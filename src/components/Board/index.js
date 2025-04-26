import { useEffect, useState } from "react";
import "./index.scss";

const host = "https://api.tripleequal.dev";

/**
 * Board – public wall of messages with create + search.
 *
 * GET  /api/messages            – list all
 * POST /api/messages            – create new
 * GET  /api/messages/search/:q  – search text
 */
export default function Board() {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loadMessages = async (q = "") => {
    try {
      const url = q
        ? `${host}/api/messages/search/${encodeURIComponent(q)}`
        : `${host}/api/messages`;
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();
      setMessages(Array.isArray(data) ? data.reverse() : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`${host}/api/messages`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, sender: "anon", recipient: "board" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setContent("");
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
        <h1>Message Board</h1>
        <form onSubmit={searchSubmit} className="search-form">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
          />
          <button>Search</button>
        </form>
      </header>

      <form onSubmit={submit} className="board-form">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write something nice..."
        />
        {error && <div className="error-message">{error}</div>}
        <button disabled={busy} className="flat-button">
          {busy ? "Posting..." : "Post"}
        </button>
      </form>

      <ul className="message-list">
        {messages.map((m) => (
          <li key={m._id} className="message-item">
            <p>{m.content}</p>
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

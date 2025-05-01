import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./index.scss";
import { HOST } from "../../links";

export default function Board() {
  const [searchParams] = useSearchParams();
  const to = searchParams.get("to"); // recipient
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState(""); // new message text
  const [query, setQuery] = useState(""); // search string
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  /* -------- fetch helpers -------- */
  const loadMessages = async (q = "") => {
    if (!to) return;
    try {
      const res = await fetch(`${HOST}/api/messages/of/${to}`, {
        credentials: "include",
      });
      const data = await res.json();
      const list = (Array.isArray(data) ? data : [])
        .filter((m) => m.to === to || m.from === to)
        .filter((m) =>
          q ? (m.body || "").toLowerCase().includes(q.toLowerCase()) : true
        )
        .reverse();
      setMessages(list);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [to]);

  /* -------- submit new message -------- */
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
        body: JSON.stringify({ body, to }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setBody("");
      loadMessages(query); // refresh with existing filter
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  /* -------- render -------- */
  return (
    <div className="board-page">
      <header className="board-header">
        <h1>Messages with {to}</h1>
      </header>

      {/* new-message form */}
      <form onSubmit={submit} className="board-form">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your message…"
        />
        {error && <div className="error-message">{error}</div>}

        <button disabled={busy} className="flat-button">
          {busy ? "Sending…" : "Send"}
        </button>
      </form>

      {/* message list */}
      <ul className="message-list">
        {messages.map((m) => (
          <li key={m._id} className="message-card">
            <div className="message-card__text">
              <p>{m.body}</p>

              {m.answer && <p className="message-card__answer">{m.answer}</p>}
            </div>

            <div className="message-card__meta">
              <time>
                {new Date(m.createdAt || m.date || Date.now()).toLocaleString()}
              </time>
              <span
                className={m.answer
                  ? "status-badge status-badge--answered"
                  : "status-badge status-badge--open"}
              >
                {m.answer ? "Answered" : "Open"}
              </span>
            </div>
          </li>
        ))}

        {messages.length === 0 && <p>No messages yet.</p>}
      </ul>
    </div>
  );
}

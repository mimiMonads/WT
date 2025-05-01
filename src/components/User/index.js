// User.jsx  –  /user
import "./index.scss";
import { useEffect, useState } from "react";
import { HOST } from "../../links";
import { Check, Clipboard } from "lucide-react"; // icons

const deleteAccount = async () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete your account? This action is irreversible.",
  );
  if (!confirmDelete) return;

  try {
    const res = await fetch(`${HOST}/user`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to delete account");

    alert("Your account has been deleted.");
    window.location.href = "/"; // redirect to home page or login
  } catch (err) {
    alert("Error deleting account.");
  }
};

export default function User() {
  const [user, setUser] = useState(null);
  const [section, setSection] = useState("inbox"); // default → inbox
  const [statusDraft, setStatusDraft] = useState("");
  const [privacyDraft, setPrivacyDraft] = useState("public");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const shareURL = `${window.location.origin}/messages?to=${user?._id ?? ""}`;

  /* ---------------- profile ---------------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${HOST}/user`, { credentials: "include" });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUser(data);
        setStatusDraft(data.status ?? "");
        setPrivacyDraft(data.privacy ?? "public");
      } catch {
        setUser(false);
      }
    })();
  }, []);

  /* --------------- inbox / questions --------------- */
  useEffect(() => {
    if (!user?._id) return;
    if (section !== "inbox" && section !== "questions") return;

    setLoading(true);
    fetch(`${HOST}/user/getM`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}), // backend ignores body
    })
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [section, user]);

  /* ---------------- actions ---------------- */
  const logout = async () => {
    await fetch(`${HOST}/logout`, { method: "GET", credentials: "include" });
    window.location.reload();
  };

  const saveStatus = async () => {
    await fetch(`${HOST}/user/status`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: statusDraft }),
    });
    setUser({ ...user, status: statusDraft });
  };

  const savePrivacy = async () => {
    await fetch(`${HOST}/user/privacy`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ privacySetting: privacyDraft }),
    });
    setUser({ ...user, privacy: privacyDraft });
  };

  const refuse = async (msgId) => {
    await fetch(`${HOST}/user/refuse`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId: msgId }),
    });
    setItems((prev) => prev.filter((m) => m._id !== msgId));
  };

  const reply = async (msgId, text) => {
    await fetch(`${HOST}/user/replay`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId: msgId, replyText: text }),
    });
    setItems((prev) =>
      prev.map((m) => (m._id === msgId ? { ...m, replied: true } : m))
    );
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareURL);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  /* ---------------- render ----------------- */
  if (user === null) return <div className="loading">Loading…</div>;
  if (user === false) {
    return <div className="login-placeholder">Please log in.</div>;
  }

  return (
    <div className="container user-page">
      {/* ─────────── SIDEBAR ─────────── */}
      <aside className="sidebar">
        <img
          src={user.profilePicture || user.avatar || "/avatar.svg"}
          alt="User"
          className="avatar"
        />
        <h2>{user.name}</h2>
        {user.email && <p>{user.email}</p>}

        {/* One-click share link */}
        <div className="share-link">
          <input readOnly value={shareURL} />
          <button onClick={copyLink} title="Copy link">
            {linkCopied ? <Check size={18} /> : <Clipboard size={18} />}
          </button>
        </div>

        <nav className="menu">
          <button
            className={section === "inbox" ? "active" : ""}
            onClick={() => setSection("inbox")}
          >
            Inbox
          </button>
          <button
            className={section === "questions" ? "active" : ""}
            onClick={() => setSection("questions")}
          >
            My Questions
          </button>
          <button
            className={section === "settings" ? "active" : ""}
            onClick={() => setSection("settings")}
          >
            Settings
          </button>
          <button onClick={logout}>Log Out</button>
          <div className="settings-block danger-zone">
            <h3>Danger Zone</h3>
            <button className="delete-account-btn" onClick={deleteAccount}>
              Delete My Account
            </button>
          </div>
        </nav>
      </aside>

      {/* ─────────── MAIN ─────────── */}
      <main className="main-content">
        {/* ---------- INBOX ---------- */}
        {section === "inbox" && (
          <>
            <h1>Inbox</h1>
            {loading && <p>Loading…</p>}
            <ul className="question-list">
              {items.map((msg) => (
                <li key={msg._id} className="question-item">
                  <div>
                    <h3>{msg.body || msg.content}</h3>
                    <small>
                      {new Date(msg.createdAt || Date.now()).toLocaleString()}
                    </small>
                  </div>

                  {/* quick actions */}
                  <div className="inbox-actions">
                    {!msg.replied && (
                      <button
                        onClick={() =>
                          reply(
                            msg._id,
                            prompt("Reply message:", `Re: ${msg.body || ""}`) ||
                              "",
                          )}
                      >
                        Reply
                      </button>
                    )}
                    <button onClick={() => refuse(msg._id)}>Delete</button>
                  </div>
                </li>
              ))}
              {!loading && items.length === 0 && <p>No messages yet.</p>}
            </ul>
          </>
        )}

        {/* ------- QUESTIONS -------- */}
        {section === "questions" && (
          <>
            <h1>My Questions</h1>
            {loading && <p>Loading…</p>}
            <ul className="question-list">
              {(items.length ? items : user.questions || []).map((q) => (
                <li key={q._id || q.id} className="question-item">
                  <p>{q.body}</p>
                  <p>{q.answer}</p>
                  <span
                    className={`status ${(q.replied || "open")}`}
                  >
                    {q.replied === true ? "Answered" : "Not yet"}
                  </span>
                </li>
              ))}
              {!loading &&
                (items.length === 0 &&
                  (!user.questions || user.questions.length === 0)) &&
                <p>No questions yet.</p>}
            </ul>
          </>
        )}

        {/* ------- SETTINGS --------- */}
        {section === "settings" && (
          <>
            <h1>Settings</h1>

            <div className="settings-block">
              <label>Status</label>
              <textarea
                className="status-input"
                value={statusDraft}
                onChange={(e) => setStatusDraft(e.target.value)}
              />
              <button className="btnSettings" onClick={saveStatus}>
                Save status
              </button>
            </div>

            <div className="settings-block">
              <label>Privacy</label>
              <select
                className="selectionOpt"
                value={privacyDraft}
                onChange={(e) => setPrivacyDraft(e.target.value)}
              >
                <option value="public">Public</option>
                <option value="friends">Friends</option>
                <option value="private">Private</option>
              </select>
              <button className="btnSettings" onClick={savePrivacy}>
                Save privacy
              </button>
            </div>

            {/* profile picture upload → /user/php */}
            <div className="settings-block">
              <label>Profile picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const form = new FormData();
                  form.append("picture", file);
                  await fetch(`${HOST}/user/php`, {
                    method: "POST",
                    credentials: "include",
                    body: form,
                  });
                  // trigger reload
                  window.location.reload();
                }}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

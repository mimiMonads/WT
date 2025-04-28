import "./index.scss";
import { useEffect, useState } from "react";

import { HOST } from "../../links";

export default function User() {
  const [user, setUser] = useState(null);
  const [section, setSection] = useState("questions");
  const [statusDraft, setStatusDraft] = useState("");
  const [privacyDraft, setPrivacyDraft] = useState("public");
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

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

  /* --------------- questions --------------- */
  useEffect(() => {
    if (section !== "questions" || !user?._id) return;
    setLoadingItems(true);
    fetch(`${HOST}/user/getM`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoadingItems(false));
  }, [section, user]);

  /* ---------------- actions ---------------- */
  const logout = async () => {
    await fetch(`${HOST}/logout`, { method: "POST", credentials: "include" });
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

  /* ---------------- render ----------------- */
  if (user === null) return <div className="loading">Loading…</div>;
  if (user === false) {
    return <div className="login-placeholder">Please log in.</div>;
  }

  return (
    <div className="container user-page">
      <aside className="sidebar">
        <img
          src={user.profilePicture || user.avatar || "/avatar.svg"}
          alt="User"
          className="avatar"
        />
        <h2>{user.name}</h2>
        {user.email && <p>{user.email}</p>}
        <nav className="menu">
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
        </nav>
      </aside>

      <main className="main-content">
        {section === "questions" && (
          <>
            <h1>My Questions</h1>
            {loadingItems && <p>Loading…</p>}
            <ul className="question-list">
              {(items.length ? items : user.questions || []).map((q) => (
                <li key={q._id || q.id} className="question-item">
                  <h3>{q.title || q.content}</h3>
                  <span
                    className={`status ${(q.status || "open").toLowerCase()}`}
                  >
                    {q.status || "Open"}
                  </span>
                </li>
              ))}
              {!loadingItems &&
                (items.length === 0 &&
                  (!user.questions || user.questions.length === 0)) &&
                <p>No questions yet.</p>}
            </ul>
          </>
        )}

        {section === "settings" && (
          <>
            <h1>Settings</h1>
            <div className="settings-block">
              <label>Status</label>
              <textarea
                value={statusDraft}
                onChange={(e) => setStatusDraft(e.target.value)}
              />
              <button onClick={saveStatus}>Save status</button>
            </div>
            <div className="settings-block">
              <label>Privacy</label>
              <select
                value={privacyDraft}
                onChange={(e) => setPrivacyDraft(e.target.value)}
              >
                <option value="public">Public</option>
                <option value="friends">Friends</option>
                <option value="private">Private</option>
              </select>
              <button onClick={savePrivacy}>Save privacy</button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

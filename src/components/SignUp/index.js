import "./index.scss";
import { useEffect, useState } from "react";
import { ArrowLeft, UserPlus } from "lucide-react";
import { HOST } from "../../links";
import AnimatedLetters from "../AnimatedLetters";

export default function SignUp({ onSuccess, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    password: "",
    profilePicture: "",
    status: "",
    privacy: "public",
  });
  const [showPwd,   setShowPwd]   = useState(false);
  const [banner,    setBanner]    = useState({ text: "", type: "" }); // error | success
  const [busy,      setBusy]      = useState(false);
  const [letterClass, setLetterClass] = useState("text-animate");

  /* animated header */
  useEffect(() => {
    const id = setTimeout(() => setLetterClass("text-animate-hover"), 3000);
    return () => clearTimeout(id);
  }, []);

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBanner({ text: "", type: "" });
    setBusy(true);

    try {
      const res  = await fetch(`${HOST}/signup`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      setBanner({ text: data.message, type: "success" });
      onSuccess?.(data);                    // parent can redirect
    } catch (err) {
      setBanner({ text: err.message, type: "error" });
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-wrapper">
      <h1 className="title">
          <AnimatedLetters
            letterClass={letterClass}
            strArray={["S", "i", "g", "n", " ", "U", "p"]}
            idx={15}
          />
        </h1>

        {onCancel && (
          <button type="button" onClick={onCancel} className="back-btn">
            <ArrowLeft size={18} /> Back
          </button>
        )}

        {/* banner */}
        {banner.text && (
          <div
            role="alert"
            className={`banner ${banner.type}`}
            onClick={() => setBanner({ text: "", type: "" })}
          >
            {banner.text}
          </div>
        )}

        <form onSubmit={submit} className="signup-form">
          {/* username */}
          <label htmlFor="name">Username</label>
          <input
            id="name"
            value={form.name}
            onChange={update("name")}
            required
            placeholder="jane_doe"
            autoComplete="username"
          />

          {/* password + eye */}
          <label htmlFor="password">Password</label>
          <div className="password-row">
            <input
              id="password"
              type={showPwd ? "text" : "password"}
              value={form.password}
              onChange={update("password")}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              className="toggle-pwd"
              aria-label={showPwd ? "Hide password" : "Show password"}
              onClick={() => setShowPwd((s) => !s)}
            >
              {showPwd ? "🙈" : "👁"}
            </button>
          </div>

          {/* picture url */}
          <label htmlFor="profile">Profile picture URL (optional)</label>
          <input
            id="profile"
            value={form.profilePicture}
            onChange={update("profilePicture")}
            placeholder="https://..."
            type="url"
          />
          {form.profilePicture && (
            <img
              src={form.profilePicture}
              alt="Preview"
              className="avatar-preview"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}

          {/* status */}
          <label htmlFor="status">Status&nbsp;(optional)</label>
          <input
            id="status"
            value={form.status}
            onChange={update("status")}
            placeholder="Hello there!"
          />

          {/* privacy */}
          <label htmlFor="privacy">Privacy</label>
          <select id="privacy" value={form.privacy} onChange={update("privacy")}>
            <option value="public">Public</option>
            <option value="friends">Friends</option>
            <option value="private">Private</option>
          </select>

          {/* submit */}
          <button type="submit" className="flat-button" disabled={busy}>
            <UserPlus size={18} />
            {busy ? "Creating…" : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}

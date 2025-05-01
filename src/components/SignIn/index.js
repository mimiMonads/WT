import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AnimatedLetters from "../AnimatedLetters";
import "./index.scss";
import { HOST } from "../../links";

export default function SignIn() {
  const navigate = useNavigate();
  const [letterClass, setLetterClass] = useState("text-animate");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);

  const [status, setStatus] = useState({ text: "", type: "" }); // "error" | "success" | ""

  /* animated header */
  useEffect(() => {
    const id = setTimeout(() => setLetterClass("text-animate-hover"), 3000);
    return () => clearTimeout(id);
  }, []);

  /* submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ text: "", type: "" });

    try {
      const resp = await fetch(HOST + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, password }),
      });
      const data = await resp.json();

      if (!resp.ok) throw new Error(data.error || "Login failed");

      setStatus({ text: data.message, type: "success" });
      if (!remember) {
        // For “remember me” you’d tweak your /login controller’s cookie maxAge.
        // Here we simply note the choice for future.
        console.debug("Login without remember-me");
      }
      navigate("/user");
    } catch (err) {
      setStatus({ text: err.message, type: "error" });
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-wrapper">
        <h1 className="title">
          <AnimatedLetters
            letterClass={letterClass}
            strArray={["S", "i", "g", "n", " ", "I", "n"]}
            idx={15}
          />
        </h1>

        <form onSubmit={handleSubmit} className="signin-form">
          {/* name */}
          <label htmlFor="name">Username</label>
          <input
            id="name"
            autoComplete="username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* password */}
          <label htmlFor="password">Password</label>
          <div className="password-row">
            <input
              type={showPwd ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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

          {/* remember me */}
          <label className="remember-row">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember me
          </label>

          {/* alerts */}
          {status.text && (
            <div
              role="alert"
              className={`banner ${status.type}`}
              onClick={() => setStatus({ text: "", type: "" })}
            >
              {status.text}
            </div>
          )}

          {/* submit */}
          <button
            type="submit"
            className="flat-button"
            disabled={!name || !password || status.type === "success"}
          >
            {status.type === "success" ? "✅ SIGNED IN" : "SIGN IN"}
          </button>

          {/* helpers */}
          <div className="helper-links">
            <Link to="/signup">Create account</Link>
            <Link to="/reset" className="forgot">
              Forgot password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

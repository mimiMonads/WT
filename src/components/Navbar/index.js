// Navbar.jsx
import "./index.scss";
import LogoT from "../../assets/images/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faClose,
  faHome,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { HOST } from "../../links";

export default function Navbar() {
  const [showNav, setShowNav] = useState(false);
  const [user, setUser] = useState(null); // null = unknown, false = not logged

  /* ───── check session once on mount ───── */
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch(`${HOST}/user`, { credentials: "include" });
        const data = res.ok ? await res.json() : false; // 401/403 → not logged
        if (!ignore) setUser(data || false);
      } catch {
        if (!ignore) setUser(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="nav-bar">
      {/* logo → home */}
      <Link className="logo" to="/" onClick={() => setShowNav(false)}>
        <img src={LogoT} alt="Logo" />
      </Link>

      {/* search (static) */}
      <div className="search-bar">
        <input type="text" placeholder="Search" />
      </div>

      {/* primary nav */}
      <nav className={showNav ? "mobile-show" : ""}>
        <NavLink exact="true" activeClassName="active" to="/">
          <FontAwesomeIcon icon={faHome} color="#f5f5f5" />
        </NavLink>

        {/* user icon → /user   or   /signIn */}
        <NavLink
          activeClassName="active"
          className="sign-link"
          to={user ? "/user" : "/signIn"}
          onClick={() => setShowNav(false)}
        >
          <FontAwesomeIcon icon={faUser} color="#f5f5f5" />
        </NavLink>

        {/* mobile “close” button */}
        <FontAwesomeIcon
          icon={faClose}
          color="#f5f5f5"
          size="2x"
          className="close-icon"
          onClick={() => setShowNav(false)}
        />
      </nav>

      {/* hamburger (mobile open) */}
      <FontAwesomeIcon
        onClick={() => setShowNav(true)}
        icon={faBars}
        color="#f5f5f5"
        size="3x"
        className="hamburger-icon"
      />
    </div>
  );
}

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
import { useState } from "react";

const Navbar = () => {
  const [showNav, setShowNav] = useState(false);

  return (
    <div className="nav-bar">
      <Link className="logo" to="/" onClick={() => setShowNav(false)}>
        <img src={LogoT} alt="" />
      </Link>
      <div className="search-bar">
        <input type="text" placeholder="Search" />
      </div>
      <nav className={showNav ? "mobile-show" : ""}>
        <NavLink exact="true" activeClassName="active" to="/">
          <FontAwesomeIcon icon={faHome} color="#f5f5f5" />
        </NavLink>

        <NavLink
          activeClassName="active"
          className="sign-link"
          to="/signIn"
          onClick={() => setShowNav(false)}
        >
          <FontAwesomeIcon icon={faUser} color="#f5f5f5" />
        </NavLink>

        <FontAwesomeIcon
          icon={faClose}
          color="#f5f5f5"
          size="2x"
          className="close-icon"
          onClick={() => setShowNav(false)}
        />
      </nav>
      <FontAwesomeIcon
        onClick={() => setShowNav(true)}
        icon={faBars}
        color="#f5f5f5"
        size="3x"
        className="hamburger-icon"
      />
    </div>
  );
};

export default Navbar;

import "./index.scss";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer">
      <nav>
        <NavLink activeClassName="active" to="/about">
          ABOUT
        </NavLink>

        <NavLink
          activeClassName="active"
          className="privacy"
          to="/privacy-policy"
        >
          PRIVACY POLICY
        </NavLink>
      </nav>
    </div>
  );
};

export default Footer;

import { Outlet } from "react-router-dom";
import "./index.scss";
import Navbar from "../Navbar";
import Footer from "../Footer";

const Layout = () => {
  return (
    <div className="App">
      <Navbar />
      <div className="page">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;

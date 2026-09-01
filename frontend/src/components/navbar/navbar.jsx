import { Link, NavLink } from "react-router-dom";

import "./navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        Legal<span>Lens</span>
      </Link>

      <div className="navbar-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/chat">Chat</NavLink>
        <NavLink to="/resources">Resources</NavLink>
        <NavLink to="/about">About</NavLink>
      </div>

      <Link to="/chat" className="navbar-button">
        Ask a Question
      </Link>
    </nav>
  );
}

export default Navbar;

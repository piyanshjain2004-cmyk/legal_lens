import { Link } from "react-router-dom";
import "./navbar.css";

function navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        Legal<span>Lens</span>
      </Link>

      <div className="navbar-links">
        <Link to="/" className="active">
          Home
        </Link>

        <Link to="/chat">
          Ask Assistant
        </Link>

        <Link to="/about">
          About
        </Link>
      </div>

      <Link to="/chat" className="navbar-button">
        Ask a Question
      </Link>
    </nav>
  );
}

export default navbar;
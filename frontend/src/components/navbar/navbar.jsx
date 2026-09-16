import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import "./navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo" onClick={closeMenu}>
        Legal<span>Lens</span>
      </Link>

      <div className={`navbar-links ${isMenuOpen ? "open" : ""}`}>
        <NavLink to="/" onClick={closeMenu}>Home</NavLink>
        <NavLink to="/chat" onClick={closeMenu}>Chat</NavLink>
        <NavLink to="/resources" onClick={closeMenu}>Resources</NavLink>
        <NavLink to="/about" onClick={closeMenu}>About</NavLink>
      </div>

      <div className="navbar-actions">
        <Link to="/chat" className="navbar-button" onClick={closeMenu}>
          Ask a Question
        </Link>
        <button 
          className={`hamburger ${isMenuOpen ? "active" : ""}`} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

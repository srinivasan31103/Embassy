import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <Link to="/" className="header-logo-left">
        <img src="/images/hiranandani-logo.png" alt="Hiranandani Communities" className="logo-img" />
      </Link>

      <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
        <NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink>
        <NavLink to="/floor-plan" onClick={() => setMenuOpen(false)}>Floor Plan</NavLink>
        <NavLink to="/features" onClick={() => setMenuOpen(false)}>Features</NavLink>
        <NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink>
      </nav>

      <div className="header-right">
        <Link to="/" className="header-logo-right-link">
          <img src="/images/fortune-city-logo.png" alt="Hiranandani Fortune City Panvel" className="logo-right-img" />
        </Link>
        <button
          className={`menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}

export default Header;

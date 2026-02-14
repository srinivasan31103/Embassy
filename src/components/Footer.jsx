import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <img src="/images/hiranandani-logo.png" alt="Hiranandani" className="footer-logo-img" />
            </div>
            <p className="footer-desc">
              Hiranandani Fortune City, Panvel — Arcadia tower offering premium
              2 & 3 BHK residences with world-class amenities. A Niranjan Hiranandani Initiative.
            </p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/floor-plan">Floor Plan</Link>
            <Link to="/features">Features</Link>
            <Link to="/contact">Contact Us</Link>
          </div>

          <div className="footer-contact">
            <h4>Contact</h4>
            <p>Hiranandani Fortune City</p>
            <p>Panvel, Navi Mumbai</p>
            <p>Maharashtra, India</p>
            <p className="footer-phone">+91 XXXXX XXXXX</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Hiranandani Communities. All Rights Reserved.</p>
          <p className="footer-disclaimer">
            RERA Registration applied. Developed by Hiranandani Communities — A Niranjan Hiranandani Initiative.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

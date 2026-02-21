import { Link, useLocation } from 'react-router-dom';
import { Camera, Code, Briefcase, Home, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { personalInfo } from '../data/personal';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Experience', path: '/experience', icon: <Briefcase size={18} /> },
    { name: 'Dev Blog', path: '/devblog', icon: <Code size={18} /> },
    { name: 'Photography', path: '/photography', icon: <Camera size={18} /> },
  ];

  const firstName = personalInfo.name.split(' ')[0];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          <span className="text-gradient">{firstName}.</span>
        </Link>

        {/* Desktop Nav */}
        <div className="nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {link.icon}
            <span>{link.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;

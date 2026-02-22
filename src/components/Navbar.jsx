import { Link, useLocation } from 'react-router-dom';
import { Camera, Code, Briefcase, Home, Menu, X, User, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { personalInfo } from '../data/personal';
import './Navbar.css';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Load theme setting initially
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.body.classList.add('light-mode');
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.home'), path: '/', icon: <Home size={18} /> },
    { name: t('nav.about'), path: '/about', icon: <User size={18} /> },
    { name: t('nav.experience'), path: '/experience', icon: <Briefcase size={18} /> },
    { name: t('nav.devBlog'), path: '/devblog', icon: <Code size={18} /> },
    { name: t('nav.photography'), path: '/photography', icon: <Camera size={18} /> },
  ];

  const firstName = personalInfo.name.split(' ')[0];

  const toggleTheme = () => {
    document.body.classList.add('theme-transition');
    setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 300);

    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('en') ? 'ja' : 'en';
    i18n.changeLanguage(newLang);
  };

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

        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%' }}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', fontWeight: '600', fontSize: '0.85rem', transition: 'all 0.2s' }}
          >
            {i18n.language.startsWith('en') ? 'EN' : 'JP'}
          </button>

          {/* Mobile Nav Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
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

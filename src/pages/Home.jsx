import { Link } from 'react-router-dom';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { personalInfo } from '../data/personal';
import './Home.css';

const Home = () => {
    return (
        <div className="home-page animate-in">
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Hi, I'm <span className="text-gradient">{personalInfo.name}</span>
                    </h1>
                    <h2 className="hero-subtitle">
                        {personalInfo.role.split(',').map((part, index) => (
                            <span key={index}>{part.trim()}{index < personalInfo.role.split(',').length - 1 ? <br /> : ''}</span>
                        ))}
                    </h2>
                    <p className="hero-description">
                        {personalInfo.bio}
                    </p>

                    <div className="hero-cta">
                        <Link to="/experience" className="btn btn-primary">
                            View My Work <ArrowRight size={18} />
                        </Link>
                        <div className="social-links">
                            {personalInfo.socialLinks?.github && (
                                <a href={personalInfo.socialLinks.github} target="_blank" rel="noopener noreferrer" className="social-icon">
                                    <Github size={24} />
                                </a>
                            )}
                            {personalInfo.socialLinks?.linkedin && (
                                <a href={personalInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon">
                                    <Linkedin size={24} />
                                </a>
                            )}
                            {personalInfo.socialLinks?.email && (
                                <a href={`mailto:${personalInfo.socialLinks.email}`} className="social-icon">
                                    <Mail size={24} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="visual-circle circle-1"></div>
                    <div className="visual-circle circle-2"></div>
                    <div className="glass-card">
                        <h3>Currently Building</h3>
                        <p>Next-gen React Applications</p>
                    </div>
                </div>
            </section>

            {/* Quick Links Section */}
            <section className="highlights-section">
                <div className="highlight-card">
                    <h3>Software Engineering</h3>
                    <p>Read about my thoughts on modern web development, architecture, and best practices.</p>
                    <Link to="/devblog" className="highlight-link">Read the Blog <ArrowRight size={16} /></Link>
                </div>
                <div className="highlight-card">
                    <h3>Photography</h3>
                    <p>Explore my visual journey through landscapes, street photography, and portraits.</p>
                    <Link to="/photography" className="highlight-link">View Gallery <ArrowRight size={16} /></Link>
                </div>
            </section>
        </div>
    );
};

export default Home;

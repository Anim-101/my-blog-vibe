import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { personalInfo } from '../data/personal';
import './Home.css';

const Home = () => {
    const { t } = useTranslation();
    return (
        <div className="home-page animate-in">
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        {t('home.greeting')} <br />
                        <span className="text-gradient">{personalInfo.name}</span>
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
                            {t('home.cta')} <ArrowRight size={18} />
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
                        <h3>{t('home.exploring')}</h3>
                        <p>{t('home.exploringSub')}</p>
                    </div>
                </div>
            </section>

            {/* Quick Links Section */}
            <section className="highlights-section">
                <div className="highlight-card">
                    <h3>{t('home.se')}</h3>
                    <p>{t('home.seDesc')}</p>
                    <Link to="/devblog" className="highlight-link">{t('home.readBlog')} <ArrowRight size={16} /></Link>
                </div>
                <div className="highlight-card">
                    <h3>{t('home.photo')}</h3>
                    <p>{t('home.photoDesc')}</p>
                    <Link to="/photography" className="highlight-link">{t('home.viewGallery')} <ArrowRight size={16} /></Link>
                </div>
            </section>
        </div>
    );
};

export default Home;

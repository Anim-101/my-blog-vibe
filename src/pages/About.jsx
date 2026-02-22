import React from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { personalInfo } from '../data/personal';
import './About.css';

const About = () => {
    // Extract username from github URL
    const githubUrlParts = personalInfo.socialLinks.github.split('/');
    const githubUsername = githubUrlParts[githubUrlParts.length - 1] || 'Anim-101';

    return (
        <div className="about-page animate-in">
            <header className="page-header">
                <h1 className="page-title">About <span className="text-gradient">Me</span></h1>
                <p className="page-subtitle">Get to know the person behind the code.</p>
            </header>

            <section className="about-main-section">
                <div className="about-image-container">
                    <img
                        src="/photos/profile.png"
                        alt={personalInfo.name}
                        className="about-image"
                        onError={(e) => {
                            e.target.src = "https://via.placeholder.com/400x500/1c1c1f/6366f1?text=Photo+Coming+Soon";
                        }}
                    />
                    <div className="about-image-backdrop"></div>
                </div>

                <div className="about-details">
                    <h2 className="about-greeting">Hi, I'm {personalInfo.name}</h2>
                    <h3 className="about-role text-gradient">{personalInfo.role}</h3>

                    <div className="about-bio">
                        {personalInfo.bio.split('. ').map((sentence, index) => (
                            sentence ? <p key={index}>{sentence}{index !== personalInfo.bio.split('. ').length - 1 ? '.' : ''}</p> : null
                        ))}
                    </div>

                    <div className="about-stats">
                        <div className="stat-card glass-card">
                            <h4>Certifications</h4>
                            <ul className="stats-list">
                                {personalInfo.certifications?.map((cert, index) => (
                                    <li key={index}>{cert}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="stat-card glass-card">
                            <h4>Focus Areas</h4>
                            <ul className="stats-list">
                                {personalInfo.expertise?.map((exp, index) => (
                                    <li key={index}>{exp}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="github-activity-section">
                <h3 className="section-title">GitHub <span className="text-gradient">Activity</span></h3>
                <p className="section-subtitle">Days I code</p>
                <div className="github-calendar-container glass-card">
                    <GitHubCalendar
                        username={githubUsername}
                        colorScheme="dark"
                        blockSize={14}
                        blockMargin={5}
                        fontSize={14}
                    />
                </div>
            </section>
        </div>
    );
};

export default About;

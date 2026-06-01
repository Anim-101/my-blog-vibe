import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GitHubCalendar } from 'react-github-calendar';
import { personalInfo } from '../data/personal';
import 'react-activity-calendar/tooltips.css';
import './About.css';

const About = () => {
    const { t } = useTranslation();
    // Extract username from github URL
    const githubUrlParts = personalInfo.socialLinks.github.split('/');
    const githubUsername = githubUrlParts[githubUrlParts.length - 1] || 'Anim-101';

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchContributions = async () => {
            try {
                // Fetch from the exact same jogruber API as react-github-calendar, and add cache-busting timestamp
                const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${githubUsername}?y=last&t=${Date.now()}`);
                if (!response.ok) throw new Error('Failed to fetch contributions');
                const data = await response.json();
                
                if (isMounted) {
                    const days = data.contributions || [];
                    const totalContributions = data.total?.lastYear || 0;
                    
                    let currentStreak = 0;
                    let longestStreak = 0;
                    let tempStreak = 0;
                    
                    for (let i = 0; i < days.length; i++) {
                        const count = days[i].count;
                        if (count > 0) {
                            tempStreak++;
                            if (tempStreak > longestStreak) {
                                longestStreak = tempStreak;
                            }
                        } else {
                            tempStreak = 0;
                        }
                    }
                    
                    for (let i = days.length - 1; i >= 0; i--) {
                        if (days[i].count > 0) {
                            currentStreak++;
                        } else {
                            // If today (last item) is 0, check if yesterday was active to keep streak alive
                            if (i === days.length - 1 && days[days.length - 2] && days[days.length - 2].count > 0) {
                                continue;
                            }
                            break;
                        }
                    }
                    
                    const activeDays = days.filter(d => d.count > 0).length;
                    
                    setStats({
                        totalContributions,
                        currentStreak,
                        longestStreak,
                        activeDays
                    });
                    setLoading(false);
                }
            } catch (err) {
                console.error(err);
                if (isMounted) {
                    setError(true);
                    setLoading(false);
                }
            }
        };
        fetchContributions();
        return () => {
            isMounted = false;
        };
    }, [githubUsername]);

    return (
        <div className="about-page animate-in">
            <header className="page-header">
                <h1 className="page-title">{t('about.title')} <span className="text-gradient">{t('about.me')}</span></h1>
                <p className="page-subtitle">{t('about.subtitle')}</p>
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
                    <h2 className="about-greeting">{t('home.greeting')} {personalInfo.name}</h2>
                    <h3 className="about-role text-gradient">{t('about.role')}</h3>

                    <div className="about-bio">
                        {t('about.bio').match(/[^.。]+[.。]+/g)?.map((sentence, index) => (
                            <p key={index}>{sentence.trim()}</p>
                        )) || <p>{t('about.bio')}</p>}
                    </div>

                    <div className="about-stats">
                        <div className="stat-card glass-card">
                            <h4>{t('about.certifications')}</h4>
                            <ul className="stats-list">
                                {personalInfo.certifications?.map((cert, index) => (
                                    <li key={index}>{cert}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="stat-card glass-card">
                            <h4>{t('about.focusAreas')}</h4>
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
                <h3 className="section-title">{t('about.githubTitle')} <span className="text-gradient">{t('about.githubActivity')}</span></h3>
                <p className="section-subtitle">{t('about.githubSubtitle')}</p>
                
                <div className="github-stats-container">
                    {loading ? (
                        <div className="github-stats-loading">
                            <div className="loading-spinner"></div>
                            <p>{t('about.github.loading')}</p>
                        </div>
                    ) : error ? (
                        <div className="github-stats-error">
                            <p>{t('about.github.error')}</p>
                        </div>
                    ) : (
                        <div className="github-stats-grid">
                            <div className="github-stat-card glass-card">
                                <span className="stat-value text-gradient">{stats.totalContributions}</span>
                                <span className="stat-label">{t('about.github.total')}</span>
                            </div>
                            <div className="github-stat-card glass-card">
                                <span className="stat-value text-gradient">{stats.currentStreak} {t('about.github.days')}</span>
                                <span className="stat-label">{t('about.github.currentStreak')}</span>
                            </div>
                            <div className="github-stat-card glass-card">
                                <span className="stat-value text-gradient">{stats.longestStreak} {t('about.github.days')}</span>
                                <span className="stat-label">{t('about.github.longestStreak')}</span>
                            </div>
                            <div className="github-stat-card glass-card">
                                <span className="stat-value text-gradient">{stats.activeDays} {t('about.github.days')}</span>
                                <span className="stat-label">{t('about.github.activeDays')}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="github-calendar-container glass-card">
                    <GitHubCalendar
                        username={githubUsername}
                        colorScheme="dark"
                        blockSize={14}
                        blockMargin={5}
                        fontSize={14}
                        tooltips={{
                            activity: {
                                text: (activity) => {
                                    const dateStr = new Date(activity.date).toLocaleDateString(undefined, {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    });
                                    const count = activity.count;
                                    const text = count === 1 ? 'contribution' : 'contributions';
                                    return `${count} ${text} on ${dateStr}`;
                                }
                            }
                        }}
                    />
                </div>
            </section>
        </div>
    );
};

export default About;

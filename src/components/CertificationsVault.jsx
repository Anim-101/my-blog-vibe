import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { personalInfo } from '../data/personal';
import './CertificationsVault.css';

const getBrandIcon = (id) => {
    switch (id) {
        case 'rhce':
        case 'rhcsa':
            return (
                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C9.5 2 7 3.5 6.5 5.5c-.3 1.2.2 2.5.8 3.5C5.1 9.5 2 10.5 2 12c0 2 5.5 3 10 3s10-1 10-3c0-1.5-3.1-2.5-5.3-3 .6-1 1.1-2.3.8-3.5C17 3.5 14.5 2 12 2zm0 1.5c1.8 0 3.7 1.1 4 2.5.2.8-.2 1.8-.6 2.5H8.6c-.4-.7-.8-1.7-.6-2.5.3-1.4 2.2-2.5 4-2.5z" />
                </svg>
            );
        case 'azure_fund':
        case 'azure_ai':
            return (
                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" aria-hidden="true">
                    <path d="M11.5 2.1C11.8 1.6 12.2 1.6 12.5 2.1L21.7 18C22 18.5 21.8 19.1 21.2 19.3L15.3 21C15 21.1 14.7 21 14.5 20.8L12.5 18.5C12.2 18.2 11.8 18.2 11.5 18.5L9.5 20.8C9.3 21 9 21.1 8.7 21L2.8 19.3C2.2 19.1 2 18.5 2.3 18L11.5 2.1Z" />
                </svg>
            );
        case 'aws':
            return (
                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" aria-hidden="true">
                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z"/>
                </svg>
            );
        case 'jlpt':
            return (
                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" aria-hidden="true">
                    <path d="M4 4c5 .6 11 .6 16 0v2c-2-.3-10-.3-12 0v2h10v2H8v10H6V10H4V8h2V6H4V4z"/>
                    <path d="M18 10h2v10h-2V10z" />
                    <path d="M2 3.2c5 .8 15 .8 20 0V4.5c-5 .5-15 .5-20 0V3.2z"/>
                </svg>
            );
        default:
            return (
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                    <path d="M12 6v6l4 2"/>
                </svg>
            );
    }
};

const CertificationsVault = () => {
    const { t } = useTranslation();
    const [flippedCards, setFlippedCards] = useState({});

    const handleMouseMove = (e, id) => {
        // Only run coordinates calculation on pointer devices with hover support
        if (window.matchMedia('(hover: none)').matches) return;
        if (flippedCards[id]) return;

        const cardWrapper = e.currentTarget;
        const rect = cardWrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;

        const tiltX = (0.5 - y / rect.height) * 15;
        const tiltY = (x / rect.width - 0.5) * 15;

        cardWrapper.style.setProperty('--reflection-x', `${percentX}%`);
        cardWrapper.style.setProperty('--reflection-y', `${percentY}%`);

        const innerCard = cardWrapper.querySelector('.cert-card');
        if (innerCard) {
            innerCard.style.transform = `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        }
    };

    const handleMouseLeave = (e, id) => {
        if (window.matchMedia('(hover: none)').matches) return;

        const cardWrapper = e.currentTarget;
        cardWrapper.style.setProperty('--reflection-x', `50%`);
        cardWrapper.style.setProperty('--reflection-y', `50%`);

        const innerCard = cardWrapper.querySelector('.cert-card');
        if (innerCard) {
            if (flippedCards[id]) {
                innerCard.style.transform = 'rotateY(180deg)';
            } else {
                innerCard.style.transform = 'none';
            }
        }
    };

    const handleCardClick = (id, e) => {
        const cardWrapper = e.currentTarget;
        setFlippedCards(prev => {
            const isFlipped = !prev[id];
            const innerCard = cardWrapper.querySelector('.cert-card');
            if (innerCard) {
                if (isFlipped) {
                    innerCard.style.transform = 'rotateY(180deg)';
                } else {
                    innerCard.style.transform = 'none';
                }
            }
            return {
                ...prev,
                [id]: isFlipped
            };
        });
    };

    return (
        <section className="certifications-vault-section">
            <div className="vault-header">
                <h3 className="vault-title section-title">
                    {t('about.certVault.title')} <span className="text-gradient">{t('about.certVault.subtitle')}</span>
                </h3>
                <p className="vault-subtitle">{t('about.certVault.desc')}</p>
            </div>

            <div className="cert-grid">
                {personalInfo.certifications?.map((cert) => {
                    const isCardFlipped = !!flippedCards[cert.id];
                    const certName = t(`about.certificationsList.${cert.id}.name`);
                    const certScore = t(`about.certificationsList.${cert.id}.score`);
                    
                    return (
                        <div
                            key={cert.id}
                            className="cert-card-wrapper"
                            onMouseMove={(e) => handleMouseMove(e, cert.id)}
                            onMouseLeave={(e) => handleMouseLeave(e, cert.id)}
                            onClick={(e) => handleCardClick(cert.id, e)}
                            style={{
                                '--brand-color': cert.color,
                                '--brand-glow-color': `${cert.color}40`
                            }}
                            id={`cert-card-wrapper-${cert.id}`}
                        >
                            <div className={`cert-card ${isCardFlipped ? 'is-flipped' : ''}`}>
                                {/* Front Face */}
                                <div className="cert-card-front">
                                    <div className="holographic-glare"></div>
                                    <div className="cert-brand-icon">
                                        {getBrandIcon(cert.id)}
                                    </div>
                                    <div className="cert-title-container">
                                        <span className="cert-issuer">
                                            {cert.id.startsWith('azure') ? 'Microsoft' : cert.id === 'aws' ? 'AWS' : cert.id.startsWith('rh') ? 'Red Hat' : 'JLPT'}
                                        </span>
                                        <h4 className="cert-name">{certName}</h4>
                                    </div>
                                    <div className="cert-flip-prompt">
                                        <span>{t('about.certVault.cardFlipPrompt')}</span>
                                        <svg className="flip-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Back Face */}
                                <div className="cert-card-back">
                                    <div className="cert-back-header">
                                        <h4 className="cert-back-title">{certName}</h4>
                                        <span className="cert-back-issuer">
                                            {cert.id.startsWith('azure') ? 'Microsoft' : cert.id === 'aws' ? 'AWS' : cert.id.startsWith('rh') ? 'Red Hat' : 'JLPT'}
                                        </span>
                                    </div>

                                    <div className="cert-details-list">
                                        <div className="cert-detail-item">
                                            <span className="detail-label">{t('about.certVault.certId')}</span>
                                            <span className="detail-value">{cert.certId}</span>
                                        </div>
                                        <div className="cert-detail-item">
                                            <span className="detail-label">{t('about.certVault.date')}</span>
                                            <span className="detail-value">{cert.date}</span>
                                        </div>
                                        <div className="cert-detail-item">
                                            <span className="detail-label">{t('about.certVault.score')}</span>
                                            <span className="detail-value">{certScore}</span>
                                        </div>
                                        <div className="cert-detail-item skills-item">
                                            <span className="detail-label">{t('about.certVault.skills')}</span>
                                            <div className="cert-skills-tags">
                                                {cert.skills.map((_, index) => {
                                                    const skillName = t(`about.certificationsList.${cert.id}.skills.${index}`);
                                                    return (
                                                        <span key={index} className="skill-tag">
                                                            {skillName}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default CertificationsVault;

import React from 'react';
import { personalInfo } from '../data/personal';

const Footer = () => {
    return (
        <footer style={{
            padding: '4rem 2rem 2rem',
            textAlign: 'center',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            marginTop: 'auto',
            color: 'var(--text-muted)'
        }}>
            <div className="container">
                <p>© {new Date().getFullYear()} {personalInfo.name}. All rights reserved.</p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Built with React, Vite, and Vanilla CSS</p>
            </div>
        </footer>
    );
};

export default Footer;

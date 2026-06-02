import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import CertificationsVault from '../components/CertificationsVault';

// 1. Mock the personal info data
vi.mock('../data/personal', () => ({
    personalInfo: {
        certifications: [
            {
                id: 'rhce',
                name: 'Red Hat Certified Engineer (RHCE)',
                score: '300/300',
                date: 'Nov 2020',
                certId: '200-244-934',
                verifyUrl: 'https://www.credly.com/test-rhce',
                skills: ['Ansible Automation', 'System Scripting'],
                color: '#e53e3e'
            },
            {
                id: 'aws',
                name: 'AWS Certified Solutions Architect – Associate',
                score: '815/1000',
                date: 'May 2023',
                certId: 'Z4D9R1K2BJQQ1S5G',
                verifyUrl: 'https://www.credly.com/test-aws',
                skills: ['VPC Architecture', 'Serverless'],
                color: '#ff9900'
            }
        ]
    }
}));

// 2. Mock useTranslation to return a mock key-string mapping
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => {
            // Return simple mocked translations for keys
            if (key === 'about.certVault.title') return 'Professional Credentials';
            if (key === 'about.certVault.subtitle') return 'Holographic Certification Vault';
            if (key === 'about.certVault.desc') return 'Interact with 3D reflective certificates. Click a card to flip and verify credentials.';
            if (key === 'about.certVault.cardFlipPrompt') return 'Click to flip';
            if (key === 'about.certVault.certId') return 'Credential ID';
            if (key === 'about.certVault.date') return 'Issue Date';
            if (key === 'about.certVault.score') return 'Score';
            if (key === 'about.certVault.skills') return 'Skills Verified';
            if (key === 'about.certVault.verify') return 'Verify Badge';
            
            // Map the certifications dynamic names, scores, and skills
            if (key === 'about.certificationsList.rhce.name') return 'Red Hat Certified Engineer (RHCE)';
            if (key === 'about.certificationsList.rhce.score') return '300/300';
            if (key === 'about.certificationsList.rhce.skills.0') return 'Ansible Automation';
            if (key === 'about.certificationsList.rhce.skills.1') return 'System Scripting';
            
            if (key === 'about.certificationsList.aws.name') return 'AWS Certified Solutions Architect – Associate';
            if (key === 'about.certificationsList.aws.score') return '815/1000';
            if (key === 'about.certificationsList.aws.skills.0') return 'VPC Architecture';
            if (key === 'about.certificationsList.aws.skills.1') return 'Serverless';
            
            return key;
        }
    })
}));

describe('CertificationsVault Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the vault header and certification cards', () => {
        const { getByText, getAllByText, container } = render(<CertificationsVault />);

        // Check header titles
        expect(getByText('Professional Credentials')).toBeDefined();
        expect(getByText('Holographic Certification Vault')).toBeDefined();
        expect(getByText('Interact with 3D reflective certificates. Click a card to flip and verify credentials.')).toBeDefined();

        // Check rendering of individual cards
        expect(getAllByText('Red Hat Certified Engineer (RHCE)').length).toBeGreaterThan(0);
        expect(getAllByText('AWS Certified Solutions Architect – Associate').length).toBeGreaterThan(0);

        const cardWrappers = container.querySelectorAll('.cert-card-wrapper');
        expect(cardWrappers.length).toBe(2);
    });

    it('toggles the card flipped state when clicked', () => {
        const { container } = render(<CertificationsVault />);
        const cardWrapper = container.querySelector('#cert-card-wrapper-rhce');
        const innerCard = cardWrapper.querySelector('.cert-card');

        // Initial state should not be flipped
        expect(innerCard.classList.contains('is-flipped')).toBe(false);

        // Click to flip
        fireEvent.click(cardWrapper);
        expect(innerCard.classList.contains('is-flipped')).toBe(true);

        // Click again to unflip
        fireEvent.click(cardWrapper);
        expect(innerCard.classList.contains('is-flipped')).toBe(false);
    });

    it('renders card details on the back face', () => {
        const { getByText, getAllByText } = render(<CertificationsVault />);

        // Skills title
        const skillsLabels = getAllByText('Skills Verified');
        expect(skillsLabels.length).toBe(2);

        // Specific details on back
        expect(getByText('200-244-934')).toBeDefined(); // RHCE ID
        expect(getByText('Z4D9R1K2BJQQ1S5G')).toBeDefined(); // AWS ID
        expect(getByText('Nov 2020')).toBeDefined(); // RHCE Date
        expect(getByText('815/1000')).toBeDefined(); // AWS Score
    });

    it('does not flip the card when clicking the verify credential button/link', () => {
        const { container } = render(<CertificationsVault />);
        const cardWrapper = container.querySelector('#cert-card-wrapper-rhce');
        const innerCard = cardWrapper.querySelector('.cert-card');
        const verifyBtn = cardWrapper.querySelector('.cert-verify-btn');

        // Initial state
        expect(innerCard.classList.contains('is-flipped')).toBe(false);

        // Click the verify button
        fireEvent.click(verifyBtn);

        // Should NOT be flipped because click event propagation is stopped
        expect(innerCard.classList.contains('is-flipped')).toBe(false);
    });
});

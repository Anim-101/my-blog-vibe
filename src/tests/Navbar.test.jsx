import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';

// 1. Mock the personal info data
vi.mock('../data/personal', () => ({
    personalInfo: {
        name: 'Test Name'
    }
}));

// 2. Mock useTranslation to control the language switching logic
const changeLanguageMock = vi.fn();
let currentLang = 'en';

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: key => key,
        i18n: {
            language: currentLang,
            changeLanguage: (lang) => {
                currentLang = lang;
                changeLanguageMock(lang);
            }
        }
    })
}));

describe('Navbar Component & Logic', () => {

    // Clean up DOM and mocks before every test
    beforeEach(() => {
        document.body.className = '';
        localStorage.clear();
        currentLang = 'en';
        vi.clearAllMocks();
    });

    it('toggles the mobile menu correctly', () => {
        const { container } = render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        const mobileMenuButton = container.querySelector('.mobile-menu-btn');
        const mobileMenu = container.querySelector('.mobile-menu');

        // Initial state should not have 'open' class
        expect(mobileMenu.className).not.toContain('open');

        // Click to open
        fireEvent.click(mobileMenuButton);
        expect(mobileMenu.className).toContain('open');

        // Click a link inside should close it
        const randomLink = container.querySelector('.mobile-nav-link');
        fireEvent.click(randomLink);
        expect(mobileMenu.className).not.toContain('open');
    });

    it('toggles the dark/light mode and updates body class & localStorage', () => {
        const { container } = render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        const themeToggleBtn = container.querySelector('.theme-toggle');

        expect(document.body.classList.contains('light-mode')).toBe(false);

        // Click to toggle to Light Mode
        fireEvent.click(themeToggleBtn);

        // Body should now have 'light-mode'
        expect(document.body.classList.contains('light-mode')).toBe(true);
        // And it should be saved physically in local storage
        expect(localStorage.getItem('theme')).toBe('light');

        // Theme Transition UI trick should be added
        expect(document.body.classList.contains('theme-transition')).toBe(true);

        // Click back to Dark Mode
        fireEvent.click(themeToggleBtn);
        expect(document.body.classList.contains('light-mode')).toBe(false);
        expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('toggles the language properly via i18n from EN to JA', () => {
        // Find the language toggle button which currently displays 'EN'
        const { getByText } = render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        const langBtn = getByText('EN');

        // Click the toggle
        fireEvent.click(langBtn);

        // The mock function we passed into i18next should have been called attempting to swap to Japanese 'ja'
        expect(changeLanguageMock).toHaveBeenCalledWith('ja');
    });
});

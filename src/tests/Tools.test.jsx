import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Tools from '../pages/Tools';

// Mock useTranslation
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => {
            const translations = {
                'nav.designer': 'Cloud Designer',
                'nav.agents': 'Agent Sandbox'
            };
            return translations[key] || key;
        }
    })
}));

describe('Tools Page Layout Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the tools sub-navbar and child links', () => {
        const { getByText, getByTestId } = render(
            <MemoryRouter>
                <Tools />
            </MemoryRouter>
        );

        // Sub-navbar container should render
        expect(getByTestId('tools-subnav')).toBeDefined();

        // Links should be present
        expect(getByText('Cloud Designer')).toBeDefined();
        expect(getByText('Agent Sandbox')).toBeDefined();
    });
});

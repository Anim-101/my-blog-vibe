import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import GitVisualizer from '../pages/GitVisualizer';

// Mock useTranslation
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key, options) => {
            const translations = {
                'git.title': 'Git Branching Sandbox',
                'git.subtitle': 'Visualize commit tree...',
                'git.run': 'Run Command',
                'git.sandbox': 'Sandbox Mode',
                'git.game': 'Challenge Mode',
                'git.level': `Level ${options?.level || ''}`,
                'git.levelTitle': 'Git Challenge',
                'git.congrats': 'Congratulations!',
                'git.nextLevel': 'Next Level',
                'git.resetLevel': 'Reset Level',
                'git.success': 'Goal achieved!',
                'git.error': 'Error',
                'git.instruction': 'Goal'
            };
            return translations[key] || key;
        }
    })
}));

describe('Git Branching Sandbox Page Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the initial state with root commit c0', () => {
        const { getByText, getByTestId, container } = render(<GitVisualizer />);
        
        expect(getByText('Git Branching Sandbox')).toBeDefined();
        expect(getByTestId('git-workspace')).toBeDefined();
        
        // Root commit circle and master/HEAD pointers should be rendered
        expect(container.textContent).toContain('C0');
        expect(container.textContent).toContain('master');
        expect(container.textContent).toContain('HEAD');
    });

    it('executes a commit command and appends c1 node', () => {
        const { container } = render(<GitVisualizer />);
        
        const input = container.querySelector('.git-terminal-input');
        
        // Execute git commit
        fireEvent.change(input, { target: { value: 'git commit -m "feat: first commit"' } });
        fireEvent.submit(container.querySelector('form'));
        
        // C1 commit should now be present in the workspace
        expect(container.textContent).toContain('C1');
        expect(container.textContent).toContain('feat: first commit');
    });

    it('executes checkout branch commands successfully', () => {
        const { container } = render(<GitVisualizer />);
        const input = container.querySelector('.git-terminal-input');

        // Create branch feature
        fireEvent.change(input, { target: { value: 'git branch feature' } });
        fireEvent.submit(container.querySelector('form'));
        expect(container.textContent).toContain('Created branch \'feature\'');

        // Checkout feature
        fireEvent.change(input, { target: { value: 'git checkout feature' } });
        fireEvent.submit(container.querySelector('form'));
        expect(container.textContent).toContain('Switched to branch \'feature\'');
    });

    it('starts game mode and displays level goal instructions', () => {
        const { getByText, container } = render(<GitVisualizer />);
        
        // Click Challenge Mode button
        const gameModeBtn = getByText('Challenge Mode');
        fireEvent.click(gameModeBtn);

        // Should render level header and setup c0
        expect(container.textContent).toContain('Git Challenge #1');
        expect(container.textContent).toContain('Create a branch named \'feature\'');
    });
});

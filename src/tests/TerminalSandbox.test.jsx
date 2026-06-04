import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import TerminalSandbox from '../components/TerminalSandbox';

// Mock i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: key => key,
        i18n: {
            language: 'en',
            changeLanguage: vi.fn()
        }
    })
}));

describe('TerminalSandbox Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the initial welcome message and prompt', () => {
        const { container } = render(<TerminalSandbox />);
        
        // Should find welcome message key
        expect(container.textContent).toContain('terminal.welcome');
        // Should show initial prompt
        expect(container.textContent).toContain('anim@animos:~ $');
    });

    it('executes help command correctly', () => {
        const { container } = render(<TerminalSandbox />);
        const input = container.querySelector('.terminal-input');
        const form = container.querySelector('form');

        // Type 'help' and submit
        fireEvent.change(input, { target: { value: 'help' } });
        fireEvent.submit(form);

        // Help text should be output
        expect(container.textContent).toContain('terminal.helpText');
    });

    it('changes themes correctly', () => {
        const { container } = render(<TerminalSandbox />);
        const input = container.querySelector('.terminal-input');
        const form = container.querySelector('form');

        // Initial theme class should be theme-glass
        expect(container.firstChild.className).toContain('theme-glass');

        // Run 'theme matrix'
        fireEvent.change(input, { target: { value: 'theme matrix' } });
        fireEvent.submit(form);

        // Theme class should update
        expect(container.firstChild.className).toContain('theme-matrix');
        expect(container.textContent).toContain('terminal.themeChanged');
    });

    it('handles clear command', () => {
        const { container } = render(<TerminalSandbox />);
        const input = container.querySelector('.terminal-input');
        const form = container.querySelector('form');

        // First execute a command to add to history
        fireEvent.change(input, { target: { value: 'help' } });
        fireEvent.submit(form);
        expect(container.textContent).toContain('terminal.helpText');

        // Clear history
        fireEvent.change(input, { target: { value: 'clear' } });
        fireEvent.submit(form);

        // The terminal screen should be cleared of the welcome message and help text
        expect(container.textContent).not.toContain('terminal.welcome');
        expect(container.textContent).not.toContain('terminal.helpText');
    });

    it('handles directory traversal and listing (cd & ls)', () => {
        const { container } = render(<TerminalSandbox />);
        const input = container.querySelector('.terminal-input');
        const form = container.querySelector('form');

        // List contents in root
        fireEvent.change(input, { target: { value: 'ls' } });
        fireEvent.submit(form);
        expect(container.textContent).toContain('bio.md');
        expect(container.textContent).toContain('skills/');

        // cd into skills
        fireEvent.change(input, { target: { value: 'cd skills' } });
        fireEvent.submit(form);
        // Prompt should reflect the directory change
        expect(container.textContent).toContain('anim@animos:~/skills $');

        // List contents in /skills
        fireEvent.change(input, { target: { value: 'ls' } });
        fireEvent.submit(form);
        expect(container.textContent).toContain('frontend.json');
    });

    it('supports tab autocomplete and choice listing', () => {
        const { container } = render(<TerminalSandbox />);
        const input = container.querySelector('.terminal-input');

        // Type 'cd ' and press Tab
        fireEvent.change(input, { target: { value: 'cd ' } });
        fireEvent.keyDown(input, { key: 'Tab', code: 'Tab' });
        // It should list the contents of the current directory (/)
        expect(container.textContent).toContain('skills');
        expect(container.textContent).toContain('bio.md');

        // Type 'cd skills/' and press Tab
        fireEvent.change(input, { target: { value: 'cd skills/' } });
        fireEvent.keyDown(input, { key: 'Tab', code: 'Tab' });
        // It should list the contents of the skills directory
        expect(container.textContent).toContain('frontend.json');
        expect(container.textContent).toContain('backend.json');
        
        // Input should remain as 'cd skills/' so user can continue typing
        expect(input.value).toBe('cd skills/');

        // Type 'ls ' and press Tab
        fireEvent.change(input, { target: { value: 'ls ' } });
        fireEvent.keyDown(input, { key: 'Tab', code: 'Tab' });
        expect(container.textContent).toContain('skills');

        // Type 'ls skills' and press Tab
        fireEvent.change(input, { target: { value: 'ls skills' } });
        fireEvent.keyDown(input, { key: 'Tab', code: 'Tab' });
        // It should autocomplete to 'ls skills/' since skills is a directory
        expect(input.value).toBe('ls skills/');

        // Type 'ls skills/' and press Tab
        fireEvent.change(input, { target: { value: 'ls skills/' } });
        fireEvent.keyDown(input, { key: 'Tab', code: 'Tab' });
        expect(container.textContent).toContain('frontend.json');
        expect(input.value).toBe('ls skills/');

        // Type 'cat ' and press Tab
        fireEvent.change(input, { target: { value: 'cat ' } });
        fireEvent.keyDown(input, { key: 'Tab', code: 'Tab' });
        expect(container.textContent).toContain('bio.md');

        // Type 'cat skills' and press Tab
        fireEvent.change(input, { target: { value: 'cat skills' } });
        fireEvent.keyDown(input, { key: 'Tab', code: 'Tab' });
        // It should autocomplete to 'cat skills/'
        expect(input.value).toBe('cat skills/');

        // Type 'cat skills/' and press Tab
        fireEvent.change(input, { target: { value: 'cat skills/' } });
        fireEvent.keyDown(input, { key: 'Tab', code: 'Tab' });
        expect(container.textContent).toContain('skills.md');
        expect(input.value).toBe('cat skills/');

        // Type 'theme ' and press Tab
        fireEvent.change(input, { target: { value: 'theme ' } });
        fireEvent.keyDown(input, { key: 'Tab', code: 'Tab' });
        expect(container.textContent).toContain('matrix');
        expect(container.textContent).toContain('cyberpunk');

        // Type 'theme m' and press Tab
        fireEvent.change(input, { target: { value: 'theme m' } });
        fireEvent.keyDown(input, { key: 'Tab', code: 'Tab' });
        expect(input.value).toBe('theme matrix');

        // Type 'theme c' and press Tab
        fireEvent.change(input, { target: { value: 'theme c' } });
        fireEvent.keyDown(input, { key: 'Tab', code: 'Tab' });
        expect(container.textContent).toContain('cyberpunk');
        expect(container.textContent).toContain('classic');
        expect(input.value).toBe('theme c');

        // Type 'theme cl' and press Tab
        fireEvent.change(input, { target: { value: 'theme cl' } });
        fireEvent.keyDown(input, { key: 'Tab', code: 'Tab' });
        expect(input.value).toBe('theme classic');
    });

    it('reads files correctly with cat', () => {
        const { container } = render(<TerminalSandbox />);
        const input = container.querySelector('.terminal-input');
        const form = container.querySelector('form');

        // Cat bio.md
        fireEvent.change(input, { target: { value: 'cat bio.md' } });
        fireEvent.submit(form);

        expect(container.textContent).toContain('terminal.bioTitle');
        expect(container.textContent).toContain('about.role');

        // Cat directory shorthand (should load skills/skills.md)
        fireEvent.change(input, { target: { value: 'cat skills' } });
        fireEvent.submit(form);
        expect(container.textContent).toContain('terminal.skillsTitle');

        // Cat explicit sub-path from parent directory
        fireEvent.change(input, { target: { value: 'cat skills/skills.md' } });
        fireEvent.submit(form);
        expect(container.textContent).toContain('terminal.skillsTitle');

        // Test fallback (typing skills/bio.md should resolve to bio.md in root)
        fireEvent.change(input, { target: { value: 'cat skills/bio.md' } });
        fireEvent.submit(form);
        expect(container.textContent).toContain('terminal.bioTitle');

        // cd into skills and test parent resolution with 'cat ../bio.md'
        fireEvent.change(input, { target: { value: 'cd skills' } });
        fireEvent.submit(form);
        fireEvent.change(input, { target: { value: 'cat ../bio.md' } });
        fireEvent.submit(form);
        expect(container.textContent).toContain('terminal.bioTitle');

        // cd into skills and test implicit parent fallback 'cat bio.md'
        fireEvent.change(input, { target: { value: 'cat bio.md' } });
        fireEvent.submit(form);
        expect(container.textContent).toContain('terminal.bioTitle');
    });

    it('runs neofetch', () => {
        const { container } = render(<TerminalSandbox />);
        const input = container.querySelector('.terminal-input');
        const form = container.querySelector('form');

        fireEvent.change(input, { target: { value: 'neofetch' } });
        fireEvent.submit(form);

        expect(container.textContent).toContain('OS: AnimOS v1.0.0');
        expect(container.textContent).toContain('Uptime:');
    });

    it('simulates ansible-playbook execution', async () => {
        const { container, findByText } = render(<TerminalSandbox />);
        const input = container.querySelector('.terminal-input');
        const form = container.querySelector('form');

        fireEvent.change(input, { target: { value: 'ansible-playbook playbooks/deploy_skills.yml' } });
        fireEvent.submit(form);

        // Should start simulation
        expect(container.textContent).toContain('terminal.playbookSimulating');

        // Wait for playbook execution to finish (delay is 1ms in tests, so it's super fast)
        const successMessage = await findByText('terminal.playbookSuccess');
        expect(successMessage).toBeDefined();
        expect(container.textContent).toContain('PLAY RECAP');
    });

    it('handles guestbook sign interactive wizard flow and listing', () => {
        const { container } = render(<TerminalSandbox />);
        const input = container.querySelector('.terminal-input');
        const form = container.querySelector('form');

        // Run 'guestbook' to list entries (should show seeded entries)
        fireEvent.change(input, { target: { value: 'guestbook' } });
        fireEvent.submit(form);
        expect(container.textContent).toContain('terminal.guestbookTitle');
        expect(container.textContent).toContain('Sarah Jenkins');

        // Run 'guestbook sign' to start wizard
        fireEvent.change(input, { target: { value: 'guestbook sign' } });
        fireEvent.submit(form);
        expect(container.textContent).toContain('Starting interactive Guestbook signature wizard');

        // Step 0: Name
        fireEvent.change(input, { target: { value: 'John Doe' } });
        fireEvent.submit(form);
        
        // Step 1: Company
        fireEvent.change(input, { target: { value: 'ACME Corp' } });
        fireEvent.submit(form);

        // Step 2: Message
        fireEvent.change(input, { target: { value: 'Great site!' } });
        fireEvent.submit(form);

        // Verify signature success and display
        expect(container.textContent).toContain('terminal.gbSignedSuccess');
        expect(container.textContent).toContain('John Doe');
        expect(container.textContent).toContain('ACME Corp');
        expect(container.textContent).toContain('Great site!');
        
        // Test clear guestbook
        fireEvent.change(input, { target: { value: 'guestbook clear' } });
        fireEvent.submit(form);
        expect(container.textContent).toContain('terminal.gbCleared');
    });

    it('handles playing and exiting the snake game', () => {
        const { container } = render(<TerminalSandbox />);
        const input = container.querySelector('.terminal-input');
        const form = container.querySelector('form');

        // Run 'snake' to start game
        fireEvent.change(input, { target: { value: 'snake' } });
        fireEvent.submit(form);

        // Board should render
        expect(container.querySelector('[data-testid="snake-game-board"]')).not.toBeNull();
        expect(container.textContent).toContain('terminal.snakeScore');

        // Change directions using keys
        fireEvent.keyDown(input, { key: 'ArrowDown' });
        // Game tick runs in background, but we can also quit
        fireEvent.keyDown(input, { key: 'q' });

        // Verify game has exited
        expect(container.querySelector('[data-testid="snake-game-board"]')).toBeNull();
        expect(container.textContent).toContain('Snake game exited.');
    });
});

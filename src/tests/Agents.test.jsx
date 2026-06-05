import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import Agents from '../pages/Agents';

// Mock useTranslation
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => {
            const translations = {
                'agents.title': 'Generative AI Agent Sandbox',
                'agents.subtitle': 'Build agentic workflows with custom models...',
                'agents.catalog': 'Component Catalog',
                'agents.canvas': 'Agent Workspace',
                'agents.emptyCanvas': 'Drag or click components from the sidebar to assemble...',
                'agents.execute': 'Execute Agent Task',
                'agents.stop': 'Stop Execution',
                'agents.clear': 'Reset Canvas',
                'agents.settings': 'Component Settings',
                'agents.exporterTitle': 'Agent Code Exporter',
                'agents.exporterSubtitle': 'Integration snippets.',
                'agents.terminalTitle': 'Agent Thought & Reasoning Console',
                'agents.terminalEmpty': 'Ready for instruction.',
                'agents.inputPlaceholder': 'e.g., Search the weather...',
                'agents.run': 'Run Task',
                'agents.delete': 'Delete Component',
                'agents.copied': 'Copied!',
                'agents.copy': 'Copy Code'
            };
            return translations[key] || key;
        }
    })
}));

describe('Generative AI Agent Sandbox Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the initial empty state and title', () => {
        const { getByText } = render(<Agents />);
        expect(getByText('Generative AI Agent Sandbox')).toBeDefined();
        expect(getByText('Drag or click components from the sidebar to assemble...')).toBeDefined();
    });

    it('adds components to the canvas, updates description, and exports code', () => {
        const { getByText, container } = render(<Agents />);
        
        // Add Claude 3.5 Sonnet Brain
        const claudeBtn = getByText('Claude 3.5 Sonnet');
        fireEvent.click(claudeBtn);

        // Should appear on canvas
        expect(container.textContent).toContain('Claude 3.5 Sonnet #1');
        expect(container.textContent).toContain('temp=0.2');

        // Verify Semantic Kernel Python output displays ChatCompletion config
        const preCode = container.querySelector('.iac-code-panel pre');
        expect(preCode.textContent).toContain('kernel.add_chat_service');
        expect(preCode.textContent).toContain('claude-3-5-sonnet');
    });

    it('allows configuring component properties (temperature)', () => {
        const { getByText, container } = render(<Agents />);

        // Add GPT-4o Brain
        const gptBtn = getByText('GPT-4o Brain');
        fireEvent.click(gptBtn);

        // Click node on canvas to open details popover
        const brainNode = container.querySelector('.canvas-node');
        fireEvent.click(brainNode);

        // Verify configuration modal is open
        expect(getByText('Component Settings')).toBeDefined();

        // Change temperature slider value
        const rangeInput = container.querySelector('input[type="range"]');
        fireEvent.change(rangeInput, { target: { value: '0.9' } });

        // Check if temperature updates
        expect(container.textContent).toContain('temp=0.9');
    });

    it('starts and stops task execution simulation', () => {
        const { getByText, container } = render(<Agents />);

        // Add Claude 3.5 Sonnet Brain so run button is not disabled
        const claudeBtn = getByText('Claude 3.5 Sonnet');
        fireEvent.click(claudeBtn);

        const runBtn = getByText('Run Task');
        fireEvent.click(runBtn);

        // Should show running logs
        expect(container.textContent).toContain('Initializing agent executor');
        expect(getByText('Stop Execution')).toBeDefined();

        // Stop execution
        fireEvent.click(getByText('Stop Execution'));
        expect(container.textContent).toContain('Execution aborted by user');
        expect(getByText('Run Task')).toBeDefined();
    });
});

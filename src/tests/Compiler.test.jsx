import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import React from 'react';
import Compiler from '../pages/Compiler';

// Mock useTranslation
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => {
            const translations = {
                'compiler.title': 'Online Code Compiler',
                'compiler.subtitle': 'Edit, execute, and preview code...',
                'compiler.run': 'Run Code',
                'compiler.stop': 'Stop',
                'compiler.clear': 'Clear Console',
                'compiler.reset': 'Reset Files',
                'compiler.fileExplorer': 'Workspace Files',
                'compiler.newFile': 'New File',
                'compiler.deleteFile': 'Delete File',
                'compiler.consoleTab': 'Console Output',
                'compiler.previewTab': 'Live Preview',
                'compiler.emptyConsole': 'Click Run Code to execute...',
                'compiler.previewError': 'HTML Live Preview is only supported...'
            };
            return translations[key] || key;
        }
    })
}));

describe('Online Code Compiler Page Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders the file explorer and compiler grid correctly', () => {
        const { getByText, getByTestId, container } = render(<Compiler />);
        
        expect(getByText('Online Code Compiler')).toBeDefined();
        expect(getByTestId('compiler-workspace')).toBeDefined();
        
        // Default workspace files should be listed
        expect(container.textContent).toContain('script.py');
        expect(container.textContent).toContain('main.js');
        expect(container.textContent).toContain('index.html');
    });

    it('runs Python code and updates console logs', async () => {
        const { getByText, container } = render(<Compiler />);
        
        // Select script.py (should be active by default)
        const textarea = container.querySelector('.editor-textarea');
        expect(textarea.value).toContain('print("Hello from Python!")');

        const runBtn = getByText('Run Code');
        fireEvent.click(runBtn);

        // Fast-forward timeout for simulation compilation/run
        await act(async () => {
            vi.advanceTimersByTime(1000);
        });

        // Verify logs contain python outputs
        expect(container.textContent).toContain('Hello from Python!');
    });

    it('runs JavaScript code and updates console logs', async () => {
        const { getByText, getAllByText, container } = render(<Compiler />);
        
        // Click on main.js tab in editor
        const jsTab = getAllByText('main.js')[0];
        fireEvent.click(jsTab);

        const textarea = container.querySelector('.editor-textarea');
        expect(textarea.value).toContain('console.log("Hello from JavaScript!");');

        const runBtn = getByText('Run Code');
        fireEvent.click(runBtn);

        // Fast-forward timeout
        await act(async () => {
            vi.advanceTimersByTime(1000);
        });

        // Verify JS outputs
        expect(container.textContent).toContain('Hello from JavaScript!');
    });

    it('switches to Live Preview tab for html file execution', async () => {
        const { getByText, getAllByText, container } = render(<Compiler />);
        
        // Click on index.html explorer item
        const htmlFile = getAllByText('index.html')[0];
        fireEvent.click(htmlFile);

        const runBtn = getByText('Run Code');
        fireEvent.click(runBtn);

        // Fast-forward timeout
        await act(async () => {
            vi.advanceTimersByTime(1000);
        });

        // Should load the iframe preview
        const iframe = container.querySelector('iframe');
        expect(iframe).toBeDefined();
        expect(iframe.srcdoc).toContain('<!DOCTYPE html>');
        expect(iframe.srcdoc).toContain('Interactive Counter');
    });

    it('runs SQL queries and renders query results inside a grid table', async () => {
        const { getByText, getAllByText, container } = render(<Compiler />);
        
        // Click on query.sql explorer item
        const sqlFile = getAllByText('query.sql')[0];
        fireEvent.click(sqlFile);

        const textarea = container.querySelector('.editor-textarea');
        expect(textarea.value).toContain('CREATE TABLE employees');

        const runBtn = getByText('Run Code');
        fireEvent.click(runBtn);

        // Fast-forward timeout
        await act(async () => {
            vi.advanceTimersByTime(1000);
        });

        // Verify it executes SQL queries and displays a table
        expect(container.querySelector('.console-log-table')).toBeDefined();
        expect(container.textContent).toContain('[SQL] Table "employees" created successfully.');
        expect(container.textContent).toContain('1 row inserted into "employees".');
        expect(container.textContent).toContain('NAME');
        expect(container.textContent).toContain('DEPARTMENT');
        expect(container.textContent).toContain('SALARY');
        expect(container.textContent).toContain('Anim Akash');
    });

    it('runs Markdown compiler and loads parsed HTML inside visual preview iframe', async () => {
        const { getByText, getAllByText, container } = render(<Compiler />);
        
        // Select README.md from explorer
        const mdFile = getAllByText('README.md')[0];
        fireEvent.click(mdFile);

        const textarea = container.querySelector('.editor-textarea');
        expect(textarea.value).toContain('# Online Web & Script Compiler');

        const runBtn = getByText('Run Code');
        fireEvent.click(runBtn);

        // Fast-forward timeout
        await act(async () => {
            vi.advanceTimersByTime(1000);
        });

        // Verify that the preview iframe contains parsed Markdown
        const iframe = container.querySelector('iframe');
        expect(iframe).toBeDefined();
        expect(iframe.srcdoc).toContain('Online Web &amp; Script Compiler');
        expect(iframe.srcdoc).toContain('Supported Features');
        expect(iframe.srcdoc).toContain('Python Scripting');
    });
});


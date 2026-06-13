import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import ResumeDebugger from '../components/ResumeDebugger';

// Mock useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'en' }
  })
}));

describe('ResumeDebugger Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the editor with developer info code', () => {
    const { getByText, container } = render(<ResumeDebugger />);

    // Header titles should render
    expect(getByText('Interactive Resume Debugger')).toBeDefined();
    expect(getByText('Developer.js')).toBeDefined();
    expect(getByText('TestConsole.log')).toBeDefined();

    // Check if code contains developer name
    const codeBlock = container.querySelector('.code-block');
    expect(codeBlock).toBeDefined();
    expect(getByText(/"Anim Akash"/)).toBeDefined();
  });

  it('switches between code view and test console tabs', () => {
    const { getByText, container } = render(<ResumeDebugger />);
    
    const consoleTab = getByText('TestConsole.log');
    
    // Switch to console tab
    fireEvent.click(consoleTab);
    
    // Terminal elements should be visible
    expect(container.querySelector('.console-view')).toBeDefined();
    expect(getByText('Terminal Output')).toBeDefined();
    expect(getByText('Assertion Checklist')).toBeDefined();
  });

  it('clicks run assertions button and starts execution suite', async () => {
    const { getByRole, getByText } = render(<ResumeDebugger />);
    
    const runBtn = getByRole('button', { name: /Run Assertions/i });
    expect(runBtn).toBeDefined();
    
    fireEvent.click(runBtn);
    
    // Button should transition to running state
    expect(runBtn.disabled).toBe(true);
    expect(getByText('Running Suite...')).toBeDefined();
  });
});

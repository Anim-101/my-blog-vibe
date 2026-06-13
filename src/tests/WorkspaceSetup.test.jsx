import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import WorkspaceSetup from '../components/WorkspaceSetup';

// Mock useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'en' }
  })
}));

describe('WorkspaceSetup Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the workspace Blueprint header and elements', () => {
    const { getByText, container } = render(<WorkspaceSetup />);

    // Header titles should render
    expect(getByText('Workspace Setup & Dotfiles')).toBeDefined();
    
    // Check SVG container renders
    const svgEl = container.querySelector('.setup-vector-svg');
    expect(svgEl).toBeDefined();

    // Check configuration detail card headers render
    expect(getByText('Zsh Shell & Neovim Configuration')).toBeDefined();
  });

  it('changes selected component details when active elements are clicked', () => {
    const { getByText, container } = render(<WorkspaceSetup />);

    // Keyboard trigger group inside SVG
    const keyboardGroup = container.querySelector('g:nth-of-type(3)');
    expect(keyboardGroup).toBeDefined();

    // Click keyboard group
    fireEvent.click(keyboardGroup);

    // Sidebar detail headers should update to keyboard specs
    expect(getByText('Mechanical Keyboard Specifications')).toBeDefined();
    expect(getByText('QMK Keymap Configuration (.json)')).toBeDefined();

    // PC trigger group inside SVG
    const pcGroup = container.querySelector('g:nth-of-type(2)');
    expect(pcGroup).toBeDefined();

    // Click PC group
    fireEvent.click(pcGroup);

    // Sidebar details should update to PC specs
    expect(getByText('Workstation System Hardware specs')).toBeDefined();
    expect(getByText('System Initialization Ansible Script (.yaml)')).toBeDefined();
  });
});

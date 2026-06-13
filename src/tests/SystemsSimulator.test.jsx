import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import SystemsSimulator from '../pages/SystemsSimulator';

// Mock useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'en' }
  })
}));

describe('SystemsSimulator Page Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the empty systems simulator layout', () => {
    const { getByText, container } = render(<SystemsSimulator />);

    expect(getByText('Systems Design Flow Simulator')).toBeDefined();
    expect(getByText('Resource Catalog')).toBeDefined();
    
    // Canvas empty state
    expect(container.querySelector('.grid-empty-state')).toBeDefined();
  });

  it('adds nodes from the catalog and updates count', () => {
    const { getByText, container } = render(<SystemsSimulator />);
    
    const clientBtn = getByText('Web Client');
    expect(clientBtn).toBeDefined();

    // Click client button to add node
    fireEvent.click(clientBtn);

    // Canvas empty state should disappear and node should render
    expect(container.querySelector('.grid-empty-state')).toBeNull();
    expect(container.querySelector('.placed-node-card')).toBeDefined();
    expect(getByText('Web Client #1')).toBeDefined();
  });

  it('runs and stops traffic simulation', () => {
    const { getByText, getByRole, container } = render(<SystemsSimulator />);

    // Add a client node
    fireEvent.click(getByText('Web Client'));

    const simulateBtn = getByRole('button', { name: /Simulate Traffic/i });
    expect(simulateBtn).toBeDefined();

    // Click simulate traffic
    fireEvent.click(simulateBtn);

    // Should change button to stop simulation
    expect(getByText('Stop Traffic')).toBeDefined();
    expect(container.querySelector('.simulator-canvas-grid.simulating')).toBeDefined();
  });
});

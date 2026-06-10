import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import JapanTravelMap from '../components/JapanTravelMap';

// Mock the react-i18next translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      language: 'en',
      changeLanguage: vi.fn(),
    },
  }),
}));

describe('JapanTravelMap Component', () => {
  it('renders the map titles and SVG grid structure', () => {
    const { getByText, container } = render(
      <MemoryRouter>
        <JapanTravelMap />
      </MemoryRouter>
    );

    // Verify header title and description are rendered
    expect(getByText('photography.mapTitle')).toBeTruthy();
    expect(getByText('photography.mapSubtitle')).toBeTruthy();

    // Verify SVG is present
    const svg = container.querySelector('.japan-constellation-svg');
    expect(svg).toBeTruthy();

    // Verify Okinawa inset description is rendered inside SVG
    expect(getByText('OKINAWA INSET')).toBeTruthy();
  });

  it('renders visited and unvisited nodes with correct glow halos', () => {
    const { container } = render(
      <MemoryRouter>
        <JapanTravelMap />
      </MemoryRouter>
    );

    // Verify all nodes are rendered
    const nodes = container.querySelectorAll('.map-node');
    expect(nodes.length).toBe(47); // 47 Prefectures of Japan

    // Visited nodes should have the class and a halo ring
    const visitedNodes = container.querySelectorAll('.map-node.visited');
    expect(visitedNodes.length).toBe(3); // Tochigi, Tokyo, Yamanashi

    const glowHalos = container.querySelectorAll('.star-glow-halo');
    expect(glowHalos.length).toBe(3);
  });

  it('displays a glassmorphic polaroid preview card on hovering a visited node', () => {
    const { container, getByText } = render(
      <MemoryRouter>
        <JapanTravelMap />
      </MemoryRouter>
    );

    // Find a visited node (e.g. Tochigi or Tokyo)
    const visitedNode = container.querySelector('.map-node.visited');
    
    // Preview card shouldn't be visible initially
    expect(container.querySelector('.map-hover-card')).toBeNull();

    // Hover visited node
    fireEvent.mouseEnter(visitedNode);

    // Preview card should be rendered
    const card = container.querySelector('.map-hover-card');
    expect(card).toBeTruthy();

    // Tag visitedLabel should be shown
    expect(getByText('photography.visitedLabel')).toBeTruthy();
  });

  it('displays unvisited tooltip placeholder on hovering an unvisited node', () => {
    const { container, getByText } = render(
      <MemoryRouter>
        <JapanTravelMap />
      </MemoryRouter>
    );

    // Find all unvisited nodes
    const unvisitedNodes = container.querySelectorAll('.map-node:not(.visited)');
    const firstUnvisitedNode = unvisitedNodes[0];

    // Hover unvisited node
    fireEvent.mouseEnter(firstUnvisitedNode);

    // Preview card should render with unvisited description
    const card = container.querySelector('.map-hover-card');
    expect(card).toBeTruthy();
    
    expect(getByText('No photo logs documented yet for this prefecture.')).toBeTruthy();
  });
});

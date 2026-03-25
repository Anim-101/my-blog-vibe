import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PhotoPost from '../pages/PhotoPost';

// Mock language translations
vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: key => key })
}));

// Mock the content utility so we control exactly what images exist
vi.mock('../utils/content', () => ({
    getPhotoPostBySlug: vi.fn(() => ({
        id: 'test-post',
        title: 'Test Post',
        images: ['/img1.jpg', '/img2.jpg', '/img3.jpg'],
        content: 'Test content'
    }))
}));

describe('PhotoPost Swipe Bug & Bounds Testing', () => {

    it('successfully handles a swipe left (moves to next image)', () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/photography/test-post']}>
                <Routes>
                    <Route path="/photography/:slug" element={<PhotoPost />} />
                </Routes>
            </MemoryRouter>
        );

        const hero = container.querySelector('.photo-hero');
        const track = container.querySelector('.slider-track');

        expect(track.style.transform).toBe('translateX(-0%)'); // Start at 0

        // Swipe Left (start right, end left)
        fireEvent.touchStart(hero, { targetTouches: [{ clientX: 300 }] });
        fireEvent.touchMove(hero, { targetTouches: [{ clientX: 100 }] });
        fireEvent.touchEnd(hero);

        expect(track.style.transform).toBe('translateX(-100%)'); // Moved 1 slide
    });

    it('proves that a rapid tap does NOT trigger a ghost swipe (Bug Fix Success)', () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/photography/test-post']}>
                <Routes>
                    <Route path="/photography/:slug" element={<PhotoPost />} />
                </Routes>
            </MemoryRouter>
        );

        const hero = container.querySelector('.photo-hero');
        const track = container.querySelector('.slider-track');

        // Initial setup swipe to get some state in history
        fireEvent.touchStart(hero, { targetTouches: [{ clientX: 300 }] });
        fireEvent.touchMove(hero, { targetTouches: [{ clientX: 100 }] });
        fireEvent.touchEnd(hero);
        expect(track.style.transform).toBe('translateX(-100%)');

        // Simulate a rapid TAP down the track
        fireEvent.touchStart(hero, { targetTouches: [{ clientX: 150 }] });
        fireEvent.touchEnd(hero);

        // Since it's a tap, the component should completely ignore it 
        // and NOT reuse the 'touchEnd' variable from the previous swipe
        expect(track.style.transform).toBe('translateX(-100%)'); // Stuck at the same place
    });

    it('ensures rapid multiple clicks (queue spam) cannot force slider out of bounds', () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/photography/test-post']}>
                <Routes>
                    <Route path="/photography/:slug" element={<PhotoPost />} />
                </Routes>
            </MemoryRouter>
        );

        const track = container.querySelector('.slider-track');
        const nextButton = container.querySelector('.slider-btn.next');

        // We have 3 images total. Maximum translateX should be -200%
        // Let's hammer the button 10 times in a row instantly
        for (let i = 0; i < 10; i++) {
            fireEvent.click(nextButton);
        }

        // Must cap at -200%, the slide index mathematically prevents going to -1000%
        expect(track.style.transform).toBe('translateX(-200%)');
    });
});

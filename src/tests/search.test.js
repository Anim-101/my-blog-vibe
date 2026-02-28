import { describe, it, expect } from 'vitest';
import Fuse from 'fuse.js';

describe('Search Algorithm (Fuse.js)', () => {
    // Mock blog post data specifically structured to test typo resistance
    const mockPosts = [
        { id: 1, title: 'Learn React in 2026', tags: ['javascript', 'frontend'] },
        { id: 2, title: 'Mastering JavaScript Closures', tags: ['node', 'js'] },
        { id: 3, title: 'CSS Grid Layouts', tags: ['css', 'design'] },
    ];

    // Configure the same search engine we built for your DevBlog page
    const fuse = new Fuse(mockPosts, {
        keys: ['title', 'tags'],
        threshold: 0.3, // Key setting: allows for fuzzy typo-matching
    });

    it('finds exact matches correctly', () => {
        const results = fuse.search('React');
        expect(results).toHaveLength(1);
        expect(results[0].item.title).toBe('Learn React in 2026');
    });

    it('finds items despite minor typos (Fuzzy matching)', () => {
        // "javascrpt" is missing the "i", but we expect it to still find "JavaScript"
        const results = fuse.search('javascrpt');

        expect(results.length).toBeGreaterThan(0);

        // It should match both posts containing "JavaScript" (one in title, one in tags)
        const matchedTitles = results.map(r => r.item.title);
        expect(matchedTitles).toContain('Mastering JavaScript Closures');
        expect(matchedTitles).toContain('Learn React in 2026');
    });

    it('returns empty array when search is completely unrelated', () => {
        // "Python" is nowhere in our mock database
        const results = fuse.search('Python');
        expect(results).toHaveLength(0);
    });
});

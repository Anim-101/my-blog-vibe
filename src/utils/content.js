import fm from 'front-matter';

// --- Blog Posts Content ---
// Vite dynamic import for markdown files
const markdownFiles = import.meta.glob('/src/content/blog/*.md', { query: '?raw', import: 'default', eager: true });

export const getBlogPosts = () => {
    const posts = Object.entries(markdownFiles).map(([path, fileContent]) => {
        // Vite with import: 'default' and query: '?raw' returns the raw string directly
        const rawContent = typeof fileContent === 'string' ? fileContent : fileContent.default || String(fileContent);
        const { attributes: data, body: content } = fm(rawContent);
        // Extract a slug from the filename (e.g., /src/content/blog/my-post.md -> my-post)
        const slug = path.split('/').pop().replace('.md', '');

        return {
            id: slug,
            slug,
            title: data.title || 'Untitled',
            date: data.date || 'No Date',
            readTime: data.readTime || '5 min read',
            excerpt: data.excerpt || content.substring(0, 150) + '...',
            content,
        };
    });

    // Sort by date (assuming YYYY-MM-DD or similar parseable date)
    return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const getBlogPostBySlug = (slug) => {
    const posts = getBlogPosts();
    return posts.find(post => post.slug === slug);
};

// --- Photography Content ---
// Load all images from assets directory
const imageFiles = import.meta.glob('/src/assets/photos/*.{png,jpg,jpeg,webp,gif}', {
    eager: true,
    import: 'default'
});

export const getPhotos = () => {
    return Object.entries(imageFiles).map(([path, url], index) => {
        // Determine title from filename (e.g. 01-landscape-mountain.jpg -> landscape mountain)
        const filename = path.split('/').pop().split('.')[0];
        const cleanTitle = filename
            .replace(/^\d+-?/, '') // Remove leading numbers (for ordering)
            .replace(/-/g, ' ')    // Replace dashes with spaces
            .replace(/\b\w/g, l => l.toUpperCase()); // Simple capitalize

        // Determine aspect based on a naming convention or default to landscape
        // You can name files like "portrait-me.jpg" or "landscape-view.jpg" to control this
        let aspect = 'landscape';
        if (filename.toLowerCase().includes('portrait')) {
            aspect = 'portrait';
        }

        return {
            id: index + 1,
            url,
            title: cleanTitle,
            aspect
        };
    });
};

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
const photographyFiles = import.meta.glob('/src/content/photography/*.md', { query: '?raw', import: 'default', eager: true });

export const getPhotoPosts = () => {
    const posts = Object.entries(photographyFiles).map(([path, fileContent]) => {
        const rawContent = typeof fileContent === 'string' ? fileContent : fileContent.default || String(fileContent);
        const { attributes: data, body: content } = fm(rawContent);
        const slug = path.split('/').pop().replace('.md', '');

        // Support array of images or fallback to single image string
        let images = [];
        if (Array.isArray(data.images) && data.images.length > 0) {
            images = data.images;
        } else if (data.image) {
            images = [data.image];
        }

        return {
            id: slug,
            slug,
            title: data.title || 'Untitled',
            images,
            aspect: data.aspect || 'landscape', // Keeping for legacy, though grid ignores it now
            date: data.date || '',
            content,
        };
    });
    return posts.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
};

export const getPhotoPostBySlug = (slug) => {
    return getPhotoPosts().find(post => post.slug === slug);
};

// --- Projects Content ---
const projectFiles = import.meta.glob('/src/content/projects/*.md', { query: '?raw', import: 'default', eager: true });

export const getProjectPosts = () => {
    const posts = Object.entries(projectFiles).map(([path, fileContent]) => {
        const rawContent = typeof fileContent === 'string' ? fileContent : fileContent.default || String(fileContent);
        const { attributes: data, body: content } = fm(rawContent);
        const slug = path.split('/').pop().replace('.md', '');
        return {
            id: slug,
            slug,
            title: data.title || 'Untitled',
            description: data.description || '',
            image: data.image || '',
            link: data.link || '#',
            tags: data.tags || [],
            content,
        };
    });
    return posts;
};

export const getProjectPostBySlug = (slug) => {
    return getProjectPosts().find(post => post.slug === slug);
};

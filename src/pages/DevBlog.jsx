import { useState, useEffect, useMemo, useDeferredValue } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getBlogPosts } from '../utils/content';
import { Calendar, Clock, ArrowRight, Search, FileX2 } from 'lucide-react';
import Fuse from 'fuse.js';
import './DevBlog.css';

const DevBlog = () => {
    const { t } = useTranslation();
    const allPosts = getBlogPosts();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;

    // STEP 1: Add a deferred value for better performance. 
    // React will wait until the user stops typing to update the deferredQuery and filter the list.
    const deferredQuery = useDeferredValue(searchQuery);

    // STEP 2: Configure Fuse.js for fuzzy typo-tolerant full-text search
    const fuse = useMemo(() => {
        return new Fuse(allPosts, {
            keys: [
                { name: 'title', weight: 3 },     // Title matches are prioritized highest
                { name: 'tags', weight: 2 },      // Tag matches are next
                { name: 'excerpt', weight: 1 },   // Then excerpt
                { name: 'content', weight: 0.5 }  // Finally, the full post body markdown content!
            ],
            threshold: 0.3, // A balance between strictness and typo-tolerance (0.0 perfect, 1.0 loose)
            ignoreLocation: true, // Don't penalize words that appear late in the text body
            includeMatches: true, // Useful if you ever want to highlight matches later
        });
    }, [allPosts]);

    // STEP 3: Execute the search based on the deferred delayed query
    const filteredPosts = useMemo(() => {
        if (!deferredQuery.trim()) return allPosts; // If empty search, return all posts

        // fuse.search returns objects shaped like { item, refIndex, score }
        // We unpack 'item' here so the rest of your app UI code can render it like normal.
        return fuse.search(deferredQuery).map(result => result.item);
    }, [deferredQuery, fuse, allPosts]);

    // Reset to page 1 if posts length changes significantly (e.g. search filter added)
    useEffect(() => {
        setCurrentPage(1);
    }, [filteredPosts.length]);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="blog-page animate-in">
            <header className="page-header">
                <h1 className="page-title">{t('devblog.title1')} <span className="text-gradient">{t('devblog.title2')}</span></h1>
                <p className="page-subtitle">{t('devblog.subtitle')}</p>
                <div className="search-container">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        className="search-input"
                        placeholder={t('devblog.searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

            <div className="blog-grid">
                {currentPosts.length > 0 ? currentPosts.map(post => (
                    <article key={post.id} className="blog-card">
                        <div className="blog-card-content">
                            <div className="blog-meta">
                                <span className="meta-item">
                                    <Calendar size={14} /> {post.date}
                                </span>
                                <span className="meta-item">
                                    <Clock size={14} /> {post.readTime}
                                </span>
                            </div>
                            <h2 className="blog-title">
                                <Link to={`/devblog/${post.slug}`}>{post.title}</Link>
                            </h2>
                            <p className="blog-excerpt">{post.excerpt}</p>

                            <Link to={`/devblog/${post.slug}`} className="read-more">
                                {t('devblog.readArticle')} <ArrowRight size={16} />
                            </Link>
                        </div>
                    </article>
                )) : (
                    <div className="no-results glass-card">
                        <div className="no-results-icon">
                            <FileX2 size={48} />
                        </div>
                        <h3>{t('devblog.noResults')}</h3>
                        <p>{t('devblog.noResultsText')} "<span className="highlight-query">{searchQuery}</span>".</p>
                        <p className="no-results-subtext">{t('devblog.tryDifferent')}</p>
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="btn btn-outline"
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                    >
                        {t('devblog.prev')}
                    </button>
                    <span className="page-info">
                        {t('devblog.page')} {currentPage} {t('devblog.of')} {totalPages}
                    </span>
                    <button
                        className="btn btn-outline"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        {t('devblog.next')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default DevBlog;

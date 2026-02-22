import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPosts } from '../utils/content';
import { Calendar, Clock, ArrowRight, Search } from 'lucide-react';
import './DevBlog.css';

const isSubsequence = (query, text) => {
    if (!query) return true;
    query = query.toLowerCase();
    text = text.toLowerCase();
    let queryIndex = 0;
    for (let i = 0; i < text.length; i++) {
        if (queryIndex === query.length) break;
        if (text[i] === query[queryIndex]) {
            queryIndex++;
        }
    }
    return queryIndex === query.length;
};

const DevBlog = () => {
    const allPosts = getBlogPosts();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;

    const filteredPosts = allPosts.filter(post => {
        // Evaluate subsequence match strictly against the title
        return isSubsequence(searchQuery, post.title);
    });

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
                <h1 className="page-title">Software <span className="text-gradient">Engineering</span></h1>
                <p className="page-subtitle">Thoughts, learnings, and deep dives into modern web development architecture.</p>
                <div className="search-container">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search articles... (Try subsequence matching, e.g., 'rtp' for 'React Patterns')"
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
                                Read Article <ArrowRight size={16} />
                            </Link>
                        </div>
                    </article>
                )) : (
                    <div className="no-results glass-card">
                        <h3>No articles found</h3>
                        <p>No articles match your subsequence search query: "{searchQuery}"</p>
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
                        Previous
                    </button>
                    <span className="page-info">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className="btn btn-outline"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default DevBlog;

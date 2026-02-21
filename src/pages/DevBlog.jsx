import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPosts } from '../utils/content';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import './DevBlog.css';

const DevBlog = () => {
    const posts = getBlogPosts();
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;

    // Reset to page 1 if posts length changes significantly (e.g. search filter added later)
    useEffect(() => {
        setCurrentPage(1);
    }, [posts.length]);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(posts.length / postsPerPage);

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
            </header>

            <div className="blog-grid">
                {currentPosts.map(post => (
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
                ))}
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

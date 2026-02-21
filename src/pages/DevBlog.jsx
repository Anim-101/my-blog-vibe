import { Link } from 'react-router-dom';
import { blogPosts } from '../data/mockData';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import './DevBlog.css';

const DevBlog = () => {
    return (
        <div className="blog-page animate-in">
            <header className="page-header">
                <h1 className="page-title">Software <span className="text-gradient">Engineering</span></h1>
                <p className="page-subtitle">Thoughts, learnings, and deep dives into modern web development architecture.</p>
            </header>

            <div className="blog-grid">
                {blogPosts.map(post => (
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
                                <Link to="#">{post.title}</Link>
                            </h2>
                            <p className="blog-excerpt">{post.excerpt}</p>

                            <Link to="#" className="read-more">
                                Read Article <ArrowRight size={16} />
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default DevBlog;

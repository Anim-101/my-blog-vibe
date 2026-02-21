import { Link } from 'react-router-dom';
import { getBlogPosts } from '../utils/content';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import './DevBlog.css';

const DevBlog = () => {
    const posts = getBlogPosts();
    console.log("DevBlog: Found posts:", posts);
    console.log("DevBlog: is Array?", Array.isArray(posts));

    return (
        <div className="blog-page animate-in">
            <header className="page-header">
                <h1 className="page-title">Software <span className="text-gradient">Engineering</span></h1>
                <p className="page-subtitle">Thoughts, learnings, and deep dives into modern web development architecture.</p>
            </header>

            <div className="blog-grid">
                {posts.map(post => (
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
        </div>
    );
};

export default DevBlog;

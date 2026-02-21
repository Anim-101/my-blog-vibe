import { useParams, Link } from 'react-router-dom';
import { getBlogPostBySlug } from '../utils/content';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './BlogPost.css';

const BlogPost = () => {
    const { slug } = useParams();
    const post = getBlogPostBySlug(slug);

    if (!post) {
        return (
            <div className="container" style={{ paddingTop: 'var(--nav-height)', textAlign: 'center' }}>
                <h2>Post not found</h2>
                <Link to="/devblog" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    Back to Blog
                </Link>
            </div>
        );
    }

    return (
        <article className="blog-post-detail animate-in">
            <div className="post-container">
                <Link to="/devblog" className="back-link">
                    <ArrowLeft size={16} /> Back to all posts
                </Link>

                <header className="post-header">
                    <h1 className="post-title">{post.title}</h1>
                    <div className="post-meta">
                        <span className="meta-item">
                            <Calendar size={16} /> {post.date}
                        </span>
                        <span className="meta-item">
                            <Clock size={16} /> {post.readTime}
                        </span>
                    </div>
                </header>

                <div className="post-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {post.content}
                    </ReactMarkdown>
                </div>
            </div>
        </article>
    );
};

export default BlogPost;

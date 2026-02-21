import { useParams, Link } from 'react-router-dom';
import { getPhotoPostBySlug } from '../utils/content';
import { ArrowLeft, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './PhotoPost.css';
import './BlogPost.css'; // Reuse markdown styles

const PhotoPost = () => {
    const { slug } = useParams();
    const post = getPhotoPostBySlug(slug);

    if (!post) {
        return (
            <div className="container" style={{ paddingTop: 'var(--nav-height)', textAlign: 'center' }}>
                <h2>Photo not found</h2>
                <Link to="/photography" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    Back to Gallery
                </Link>
            </div>
        );
    }

    return (
        <article className="photo-post-detail animate-in">
            <div className="photo-hero">
                <img src={post.image} alt={post.title} className={post.aspect} />
            </div>

            <div className="post-container">
                <Link to="/photography" className="btn btn-outline back-link">
                    <ArrowLeft size={16} /> Back to Gallery
                </Link>

                <header className="post-header">
                    <h1 className="post-title">{post.title}</h1>
                    {post.date && (
                        <div className="post-meta">
                            <span className="meta-item">
                                <Calendar size={16} /> {post.date}
                            </span>
                        </div>
                    )}
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

export default PhotoPost;

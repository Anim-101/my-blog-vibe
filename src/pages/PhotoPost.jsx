import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPhotoPostBySlug } from '../utils/content';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './PhotoPost.css';
import './BlogPost.css'; // Reuse markdown styles

const PhotoPost = () => {
    const { slug } = useParams();
    const post = getPhotoPostBySlug(slug);
    const [currentIndex, setCurrentIndex] = useState(0);

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

    const nextImage = () => {
        if (post.images && currentIndex < post.images.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const prevImage = () => {
        if (post.images && currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const hasMultipleImages = post.images && post.images.length > 1;

    return (
        <article className="photo-post-detail animate-in">
            <div className={`photo-hero ${hasMultipleImages ? 'has-slider' : ''}`}>
                <div
                    className="slider-track"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {post.images && post.images.map((imgUrl, idx) => (
                        <img key={idx} src={imgUrl} alt={`${post.title} - ${idx + 1}`} className="carousel-image" />
                    ))}
                </div>

                {hasMultipleImages && (
                    <>
                        <button
                            className="slider-btn prev"
                            onClick={prevImage}
                            disabled={currentIndex === 0}
                            aria-label="Previous image"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            className="slider-btn next"
                            onClick={nextImage}
                            disabled={currentIndex === post.images.length - 1}
                            aria-label="Next image"
                        >
                            <ChevronRight size={24} />
                        </button>

                        <div className="slider-dots">
                            {post.images.map((_, idx) => (
                                <button
                                    key={idx}
                                    className={`dot ${idx === currentIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentIndex(idx)}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
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

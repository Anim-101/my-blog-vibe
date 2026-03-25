import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { getPhotoPostBySlug } from '../utils/content';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './PhotoPost.css';
import './BlogPost.css'; // Reuse markdown styles

const PhotoPost = () => {
    const { t } = useTranslation();
    const { slug } = useParams();
    const post = getPhotoPostBySlug(slug);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Bug Fix 1: Reset slider index when navigating to a new photo post
    useEffect(() => {
        setCurrentIndex(0);
    }, [slug]);

    if (!post) {
        return (
            <div className="container" style={{ paddingTop: 'var(--nav-height)', textAlign: 'center' }}>
                <h2>{t('post.photoNotFound')}</h2>
                <Link to="/photography" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    {t('post.backGallery')}
                </Link>
            </div>
        );
    }

    // Bug Fix 2: Add touch swiping for real Instagram-like mobile feel
    const touchStart = useRef(null);
    const touchEnd = useRef(null);
    const minSwipeDistance = 50;

    // Bug Fix 3: Use functional state updates to prevent rapid double-clicks from going out of bounds
    const nextImage = () => {
        if (post.images) {
            setCurrentIndex(prev => Math.min(prev + 1, post.images.length - 1));
        }
    };

    const prevImage = () => {
        if (post.images) {
            setCurrentIndex(prev => Math.max(prev - 1, 0));
        }
    };

    const onTouchStart = (e) => {
        touchEnd.current = null;
        touchStart.current = e.targetTouches[0].clientX;
    };

    const onTouchMove = (e) => {
        touchEnd.current = e.targetTouches[0].clientX;
    };

    const onTouchEndAction = () => {
        if (!touchStart.current || !touchEnd.current) return;
        const distance = touchStart.current - touchEnd.current;
        if (distance > minSwipeDistance) {
            nextImage(); // Swiped left
        } else if (distance < -minSwipeDistance) {
            prevImage(); // Swiped right
        }
    };

    const hasMultipleImages = post.images && post.images.length > 1;

    return (
        <article className="photo-post-detail animate-in">
            <div
                className={`photo-hero ${hasMultipleImages ? 'has-slider' : ''}`}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEndAction}
            >
                <div
                    className="slider-track"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {post.images && post.images.map((imgUrl, idx) => (
                        <div key={idx} className="carousel-slide">
                            <img
                                src={imgUrl}
                                alt={`${post.title} - ${idx + 1}`}
                                className="carousel-image"
                            />
                        </div>
                    ))}
                </div>

                {hasMultipleImages && (
                    <>
                        {/* Bug Fix 4: Use 'disabled' attribute instead of conditionally hiding buttons, so CSS :disabled styles apply gracefully */}
                        <button
                            className="slider-btn prev"
                            onClick={prevImage}
                            aria-label={t('post.prevImage')}
                            disabled={currentIndex === 0}
                        >
                            <ChevronLeft size={24} />
                            {currentIndex > 0 && (
                                <img src={post.images[currentIndex - 1]} alt={t('post.prevImage')} className="btn-preview prev-preview" />
                            )}
                        </button>

                        <button
                            className="slider-btn next"
                            onClick={nextImage}
                            aria-label={t('post.nextImage')}
                            disabled={currentIndex === post.images.length - 1}
                        >
                            <ChevronRight size={24} />
                            {currentIndex < post.images.length - 1 && (
                                <img src={post.images[currentIndex + 1]} alt={t('post.nextImage')} className="btn-preview next-preview" />
                            )}
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
                    <ArrowLeft size={16} /> {t('post.backGallery')}
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

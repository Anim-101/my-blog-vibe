import { useParams, Link } from 'react-router-dom';
import { getProjectPostBySlug } from '../utils/content';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './ProjectPost.css';
import './BlogPost.css'; // Reuse markdown styles

const ProjectPost = () => {
    const { slug } = useParams();
    const post = getProjectPostBySlug(slug);

    if (!post) {
        return (
            <div className="container" style={{ paddingTop: 'var(--nav-height)', textAlign: 'center' }}>
                <h2>Project not found</h2>
                <Link to="/experience" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    Back to Experience
                </Link>
            </div>
        );
    }

    return (
        <article className="project-post-detail animate-in">
            <div className="post-container" style={{ paddingTop: '3rem' }}>
                <Link to="/experience" className="btn btn-outline back-link" style={{ marginBottom: '2rem' }}>
                    <ArrowLeft size={16} /> Back to Projects
                </Link>

                <div className="project-hero-image">
                    <img src={post.image} alt={post.title} className="project-detail-img" />
                </div>

                <header className="post-header">
                    <h1 className="post-title">{post.title}</h1>
                    <p className="project-subtitle-large">{post.description}</p>

                    <div className="project-links-meta" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                        {post.link && post.link !== '#' && (
                            <a href={post.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                <ExternalLink size={16} /> Live Demo
                            </a>
                        )}
                        {post.github && (
                            <a href={post.github} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                                <Github size={16} /> View Source
                            </a>
                        )}
                    </div>

                    <div className="project-tags" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {post.tags?.map((tag, i) => (
                            <span key={i} className="tech-badge" style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>{tag}</span>
                        ))}
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

export default ProjectPost;

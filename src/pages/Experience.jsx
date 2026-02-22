import { useTranslation } from 'react-i18next';
import { experiences } from '../data/personal';
import { getProjectPosts } from '../utils/content';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Experience.css';

const Experience = () => {
    const { t } = useTranslation();
    const projects = getProjectPosts();

    return (
        <div className="experience-page animate-in">
            <header className="page-header">
                <h1 className="page-title">{t('experience.title')} <span className="text-gradient">{t('experience.journey')}</span></h1>
                <p className="page-subtitle">{t('experience.subtitle')}</p>
            </header>

            <section className="timeline-section">
                <div className="timeline">
                    {experiences.map((exp, index) => (
                        <div key={exp.id} className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content gap">
                                <div className="timeline-header">
                                    <h3>{t(`experience.roles.${exp.id}.role`, { defaultValue: exp.role })}</h3>
                                    <span className="timeline-period">{exp.period}</span>
                                </div>
                                <h4 className="timeline-company">{t(`experience.roles.${exp.id}.company`, { defaultValue: exp.company })}</h4>
                                <p className="timeline-desc">{t(`experience.roles.${exp.id}.description`, { defaultValue: exp.description })}</p>
                                <div className="tech-stack">
                                    {exp.technologies.map(tech => (
                                        <span key={tech} className="tech-badge">{tech}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="projects-section">
                <div className="projects-grid">
                    {projects.map(project => (
                        <div key={project.id} className="project-card">
                            <div className="project-image-wrap">
                                <img src={project.image} alt={project.title} loading="lazy" />
                                <div className="project-overlay">
                                    <Link to={`/project/${project.slug}`} className="btn btn-primary">
                                        Read Case Study <ExternalLink size={16} />
                                    </Link>
                                </div>
                            </div>
                            <div className="project-info">
                                <h3><Link to={`/project/${project.slug}`}>{project.title}</Link></h3>
                                <p>{project.description}</p>
                                <div className="tech-stack">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="tech-badge">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Experience;

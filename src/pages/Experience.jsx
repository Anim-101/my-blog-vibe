import { experiences, projects } from '../data/mockData';
import { ExternalLink } from 'lucide-react';
import './Experience.css';

const Experience = () => {
    return (
        <div className="experience-page animate-in">
            <header className="page-header">
                <h1 className="page-title">Experience & <span className="text-gradient">Work</span></h1>
                <p className="page-subtitle">A timeline of my professional journey and selected case studies.</p>
            </header>

            <section className="timeline-section">
                <h2>Professional Timeline</h2>
                <div className="timeline">
                    {experiences.map((exp, index) => (
                        <div key={exp.id} className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content gap">
                                <div className="timeline-header">
                                    <h3>{exp.role}</h3>
                                    <span className="timeline-period">{exp.period}</span>
                                </div>
                                <h4 className="timeline-company">{exp.company}</h4>
                                <p className="timeline-desc">{exp.description}</p>
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
                <h2>Selected Projects</h2>
                <div className="projects-grid">
                    {projects.map(project => (
                        <div key={project.id} className="project-card">
                            <div className="project-image-wrap">
                                <img src={project.image} alt={project.title} loading="lazy" />
                                <div className="project-overlay">
                                    <a href={project.link} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                                        View Project <ExternalLink size={16} style={{ marginLeft: '0.5rem' }} />
                                    </a>
                                </div>
                            </div>
                            <div className="project-info">
                                <h3>{project.title}</h3>
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

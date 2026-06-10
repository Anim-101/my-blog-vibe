import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getPhotoPosts } from '../utils/content';
import { ZoomIn, Compass, Camera } from 'lucide-react';
import JapanTravelMap from '../components/JapanTravelMap';
import './Photography.css';

const Photography = () => {
    const { t } = useTranslation();
    const photos = getPhotoPosts();
    const [activeView, setActiveView] = useState('grid');

    return (
        <div className="photo-page animate-in">
            <header className="page-header">
                <h1 className="page-title">{t('photography.title1')} <span className="text-gradient">{t('photography.title2')}</span></h1>
                <p className="page-subtitle">{t('photography.subtitle')}</p>
            </header>

            {/* Premium View Toggle Selector */}
            <div className="photo-view-selector">
                <button
                    className={`view-tab-btn ${activeView === 'map' ? 'active' : ''}`}
                    onClick={() => setActiveView('map')}
                >
                    <Compass size={18} />
                    <span>{t('photography.viewMap')}</span>
                </button>
                <button
                    className={`view-tab-btn ${activeView === 'grid' ? 'active' : ''}`}
                    onClick={() => setActiveView('grid')}
                >
                    <Camera size={18} />
                    <span>{t('photography.viewGrid')}</span>
                </button>
            </div>

            {/* Conditional Views */}
            {activeView === 'map' ? (
                <JapanTravelMap />
            ) : (
                <div className="photo-grid">
                    {photos.map((photo) => (
                        <Link
                            to={`/photography/${photo.slug}`}
                            key={photo.id}
                            className={`photo-item`}
                        >
                            <img 
                                src={photo.images[0]} 
                                alt={photo.title} 
                                loading="lazy" 
                                decoding="async" 
                                onContextMenu={(e) => e.preventDefault()}
                                onDragStart={(e) => e.preventDefault()}
                                style={{ userSelect: 'none', WebkitUserDrag: 'none' }}
                            />
                            <div className="photo-overlay">
                                <span className="photo-title">{photo.title}</span>
                                <ZoomIn size={24} color="white" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Photography;

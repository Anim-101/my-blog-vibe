import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getPhotoPosts } from '../utils/content';
import { ZoomIn } from 'lucide-react';
import './Photography.css';

const Photography = () => {
    const { t } = useTranslation();
    const photos = getPhotoPosts();

    return (
        <div className="photo-page animate-in">
            <header className="page-header">
                <h1 className="page-title">{t('photography.title1')} <span className="text-gradient">{t('photography.title2')}</span></h1>
                <p className="page-subtitle">{t('photography.subtitle')}</p>
            </header>

            <div className="photo-grid">
                {photos.map((photo) => (
                    <Link
                        to={`/photography/${photo.slug}`}
                        key={photo.id}
                        className={`photo-item`}
                    >
                        <img src={photo.images[0]} alt={photo.title} loading="lazy" decoding="async" />
                        <div className="photo-overlay">
                            <span className="photo-title">{photo.title}</span>
                            <ZoomIn size={24} color="white" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Photography;

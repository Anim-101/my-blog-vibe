import { useState } from 'react';
import { getPhotos } from '../utils/content';
import { X, ZoomIn } from 'lucide-react';
import './Photography.css';

const Photography = () => {
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const photos = getPhotos();

    const openLightbox = (photo) => {
        setSelectedPhoto(photo);
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    const closeLightbox = () => {
        setSelectedPhoto(null);
        document.body.style.overflow = 'auto';
    };

    // Close on escape key
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') closeLightbox();
    };

    return (
        <div className="photo-page animate-in" onKeyDown={handleKeyDown} tabIndex="0">
            <header className="page-header">
                <h1 className="page-title">Through the <span className="text-gradient">Lens</span></h1>
                <p className="page-subtitle">A collection of moments captured around the world.</p>
            </header>

            <div className="photo-grid">
                {photos.map((photo) => (
                    <div
                        key={photo.id}
                        className={`photo-item ${photo.aspect}`}
                        onClick={() => openLightbox(photo)}
                    >
                        <img src={photo.url} alt={photo.title} loading="lazy" />
                        <div className="photo-overlay">
                            <span className="photo-title">{photo.title}</span>
                            <ZoomIn size={24} color="white" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {selectedPhoto && (
                <div className="lightbox active" onClick={closeLightbox}>
                    <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">
                        <X size={32} />
                    </button>
                    <div className="lightbox-content" onClick={e => e.stopPropagation()}>
                        <img src={selectedPhoto.url} alt={selectedPhoto.title} />
                        <div className="lightbox-caption">{selectedPhoto.title}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Photography;

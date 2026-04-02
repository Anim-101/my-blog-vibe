import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getPhotoPosts } from '../utils/content';
import './Memory.css';

const Memory = () => {
    const navigate = useNavigate();
    
    // Memoize the photos array so it doesn't return a new array reference every render,
    // which was triggering the stars useMemo to re-roll random coordinates on every hover state change!
    const photos = useMemo(() => {
        let basePhotos = getPhotoPosts();
        
        // If there are fewer than 30 photos, generate some beautiful placeholder memories
        if (basePhotos.length < 30) {
            const dummyPhotos = [];
            const required = 30 - basePhotos.length;
            for (let i = 0; i < required; i++) {
                dummyPhotos.push({
                    id: `dummy-${i}`,
                    title: `Cosmic Memory #${i + 1}`,
                    images: [`https://picsum.photos/seed/${i + 100}/400/400`], 
                });
            }
            return [...basePhotos, ...dummyPhotos];
        }
        return basePhotos;
    }, []);

    const containerRef = useRef(null);
    const spaceRef = useRef(null);
    const [activeStarId, setActiveStarId] = useState(null);

    // Generate random positions ONLY ONCE using useMemo
    const stars = useMemo(() => {
        return photos.map(photo => {
            // Safe Zone bounds so images don't clip off the screen edges!
            // Top: 25% to 75% | Left: 15% to 85%
            const top = 25 + Math.random() * 50;
            const left = 15 + Math.random() * 70;
            
            // Random animation delay so they don't twinkle synchronously
            const delay = Math.random() * 3 + 's';
            
            // Instead of tiny 6px white dots, let's make them 30px-50px glowing picture orbs!
            const size = 35 + Math.random() * 25; 
            const rotation = `${Math.random() * 16 - 8}deg`; // -8 to +8 degrees rotation for polaroid effect
            
            return {
                ...photo,
                position: { top: `${top.toFixed(2)}%`, left: `${left.toFixed(2)}%` },
                style: { 
                    animationDelay: delay, 
                    width: `${size.toFixed(2)}px`, 
                    height: `${size.toFixed(2)}px`,
                    '--rotation': rotation // Pass CSS variable dynamically!
                }
            };
        });
    }, [photos]);

    // Generate random background purely aesthetic stars
    const bgStars = useMemo(() => {
        const arr = [];
        for (let i = 0; i < 150; i++) {
            arr.push({
                id: i,
                top: `${(Math.random() * 100).toFixed(2)}%`,
                left: `${(Math.random() * 100).toFixed(2)}%`,
                size: `${(Math.random() * 2 + 1).toFixed(2)}px`,
                delay: `${(Math.random() * 5).toFixed(2)}s`,
                driftDelay: `-${(Math.random() * 60).toFixed(2)}s`
            });
        }
        return arr;
    }, []);

    // Generate shooting stars
    const shootingStars = useMemo(() => {
        const arr = [];
        for (let i = 0; i < 6; i++) {
            arr.push({
                id: i,
                top: `${(Math.random() * 50).toFixed(2)}%`, // Start higher up
                left: `${(50 + Math.random() * 50).toFixed(2)}%`, // Start more to the right
                delay: `${(Math.random() * 15).toFixed(2)}s`
            });
        }
        return arr;
    }, []);

    useEffect(() => {
        const handleGlobalMouseMove = (e) => {
            if (!spaceRef.current) return;
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth) * 2 - 1;
            const y = (clientY / window.innerHeight) * 2 - 1;
            // Increased the parallax multiplier to make movement extremely visible and fast
            spaceRef.current.style.transform = `translate(${x * -90}px, ${y * -90}px)`;
        };

        window.addEventListener('mousemove', handleGlobalMouseMove);
        return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
    }, []);

    const handleBackgroundClick = (e) => {
        if (e.target.classList.contains('memory-space') || e.target.classList.contains('memory-container')) {
            setActiveStarId(null);
        }
    };

    const handleStarClick = (e, id) => {
        e.stopPropagation();
        // If clicking same star on mobile, might want to go to the page? 
        // For now, toggle the preview window.
        setActiveStarId(activeStarId === id ? null : id);
    };

    return (
        <div 
            className="memory-container" 
            onClick={handleBackgroundClick}
            ref={containerRef}
        >
            <button className="memory-close" onClick={() => navigate(-1)} aria-label="Go back">
                <ArrowLeft size={24} />
            </button>

            {/* Subtly shifting background based on mouse */}
            <div 
                className="memory-space"
                ref={spaceRef}
            >
                {/* Background purely aesthetic stars */}
                {bgStars.map(star => (
                    <div 
                        key={`bg-${star.id}`}
                        className="bg-star"
                        style={{
                            top: star.top,
                            left: star.left,
                            width: star.size,
                            height: star.size,
                            animationDelay: `${star.delay}, ${star.driftDelay}`
                        }}
                    />
                ))}

                {/* Shooting stars */}
                {shootingStars.map(star => (
                    <div 
                        key={`shoot-${star.id}`}
                        className="shooting-star"
                        style={{
                            top: star.top,
                            left: star.left,
                            animationDelay: star.delay
                        }}
                    />
                ))}

                {/* The "Memory" Photo Stars */}
                {stars.map((star) => {
                    const isActive = activeStarId === star.id;
                    return (
                        <div 
                            key={star.id}
                            className="memory-star-wrapper"
                            style={{
                                top: star.position.top,
                                left: star.position.left,
                                animation: `float 10s infinite ease-in-out ${star.style.animationDelay}`
                            }}
                        >
                            <div
                                className={`memory-star ${isActive ? 'active' : ''}`}
                                style={{
                                    width: star.style.width,
                                    height: star.style.height,
                                    '--rotation': star.style['--rotation'],
                                    backgroundImage: star.images && star.images[0] ? `url(${star.images[0]})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    animation: `twinkle 4s infinite alternate ${star.style.animationDelay}`
                                }}
                                onMouseEnter={() => setActiveStarId(star.id)}
                                onMouseLeave={() => setActiveStarId(null)}
                                onClick={(e) => handleStarClick(e, star.id)}
                            >
                                <div className="memory-preview">
                                    {star.images && star.images[0] && (
                                        <img src={star.images[0]} alt={star.title} />
                                    )}
                                    <h3 className="memory-title">{star.title}</h3>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Memory;

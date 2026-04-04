import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getMemoryPhotos } from '../utils/content';
import './Memory.css';

const Memory = () => {
    const navigate = useNavigate();
    
    // Memoize the photos array so it doesn't return a new array reference every render,
    // which was triggering the stars useMemo to re-roll random coordinates on every hover state change!
    const photos = useMemo(() => {
        // Exclusively load raw memory image files!
        return getMemoryPhotos();
    }, []);

    const containerRef = useRef(null);
    const spaceRef = useRef(null);
    const [activeStarId, setActiveStarId] = useState(null);

    // Generate random but EVENLY SPACED positions using a Jittered Grid layout
    const stars = useMemo(() => {
        const cols = Math.ceil(Math.sqrt(photos.length)) || 1;
        const rows = Math.ceil(photos.length / cols) || 1;

        return photos.map((photo, i) => {
            // Assign to a grid cell
            const col = i % cols;
            const row = Math.floor(i / cols);

            // Safe Zone: Compress vertical padding to prevent top/bottom clipping on hover expansions
            const cellWidth = 80 / cols;
            const cellHeight = 56 / rows;

            const baseLeft = 10 + (col * cellWidth);
            const baseTop = 22 + (row * cellHeight); // Starts at 22%, ends at 78%

            // Jitter randomly within its designated cell so it feels scattered but never clumps!
            const left = baseLeft + (Math.random() * (cellWidth * 0.7));
            const top = baseTop + (Math.random() * (cellHeight * 0.7));
            
            // Random animation delay so they don't twinkle synchronously
            const delay = Math.random() * 3 + 's';
            
            // Orbs from 35px to 60px
            const size = 35 + Math.random() * 25; 
            const rotation = `${Math.random() * 16 - 8}deg`; // -8 to +8 degrees rotation for polaroid effect
            
            return {
                ...photo,
                position: { top: `${top.toFixed(2)}%`, left: `${left.toFixed(2)}%` },
                style: { 
                    animationDelay: delay, 
                    width: `${size.toFixed(2)}px`, 
                    height: `${size.toFixed(2)}px`,
                    '--rotation': rotation 
                },
                isNearBottom: top > 50
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

    // State-based dynamic shooting stars so they spawn randomly over time instead of repeating CSS keyframes
    const [shootingStars, setShootingStars] = useState([]);

    useEffect(() => {
        const spawnShootingStar = () => {
            const newStar = {
                id: Date.now() + Math.random(),
                top: `${(Math.random() * 60).toFixed(2)}%`, // Start upper chunk
                left: `${(30 + Math.random() * 70).toFixed(2)}%`, // Start middle-to-right
            };
            setShootingStars(prev => [...prev, newStar]);

            // Clean it up exactly when its 3-second CSS animation ends
            setTimeout(() => {
                setShootingStars(prev => prev.filter(s => s.id !== newStar.id));
            }, 3000);
        };

        // Every 2 seconds, 60% chance to spawn a comet!
        const interval = setInterval(() => {
            if (Math.random() > 0.4) spawnShootingStar();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const targetRef = useRef({ x: 0, y: 0 });
    const currentRef = useRef({ x: 0, y: 0 });
    const requestRef = useRef();

    useEffect(() => {
        // Anti-scrapping: Tell AI bots and search engines NOT to index the memory pictures
        const meta = document.createElement('meta');
        meta.name = "robots";
        meta.content = "noindex, noimageindex, noarchive";
        document.head.appendChild(meta);

        // Hardware-synchronized 60fps game loop for perfectly buttery parallax
        const updateParallax = () => {
            if (spaceRef.current) {
                // Linear Interpolation (Lerp): Move 5% of the distance to the target every single frame.
                // This creates natural mass/inertia without CSS conflicts!
                currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.05;
                currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.05;
                
                spaceRef.current.style.transform = `translate3d(${currentRef.current.x}px, ${currentRef.current.y}px, 0px)`;
            }
            requestRef.current = requestAnimationFrame(updateParallax);
        };

        const handleGlobalMouseMove = (e) => {
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth) * 2 - 1;
            const y = (clientY / window.innerHeight) * 2 - 1;
            // Record target: Keep massive horizontal parallax (90px), but limit vertical (40px)
            // This prevents stars from slamming into the vertical screen boundaries and clipping popups
            targetRef.current = { x: x * -90, y: y * -40 };
        };

        window.addEventListener('mousemove', handleGlobalMouseMove);
        requestRef.current = requestAnimationFrame(updateParallax);

        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            document.head.removeChild(meta); // Clean up the anti-AI bot tag when leaving memory page
        };
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
                            left: star.left
                        }}
                    />
                ))}

                {/* The "Memory" Photo Stars */}
                {stars.map((star) => {
                    const isActive = activeStarId === star.id;
                    return (
                        <div 
                            key={star.id}
                            className={`memory-star-wrapper ${star.isNearBottom ? 'near-bottom' : ''}`}
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
                                        <img 
                                            src={star.images[0]} 
                                            alt={star.title}
                                            onContextMenu={(e) => e.preventDefault()} // Disable right-click saving
                                            onDragStart={(e) => e.preventDefault()} // Disable drag-and-drop saving
                                            style={{ userSelect: 'none', WebkitUserDrag: 'none' }} // Disable selection
                                        />
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

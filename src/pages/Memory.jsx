import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getMemoryPhotos } from '../utils/content';
import './Memory.css';

// A simple deterministic PRNG (pseudo-random number generator) to satisfy React 19 rules of hook purity
const seededRandom = (seedString) => {
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
        hash = seedString.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Sine-based deterministic pseudo-random float between 0 and 1
    const x = Math.sin(hash) * 10000;
    return x - Math.floor(x);
};

const Memory = () => {
    const navigate = useNavigate();
    
    // Track viewport size dynamically to calculate aspect ratio grid layout
    const [viewportSize, setViewportSize] = useState(() => ({
        width: typeof window !== 'undefined' ? window.innerWidth : 1200,
        height: typeof window !== 'undefined' ? window.innerHeight : 800
    }));

    useEffect(() => {
        const handleResize = () => {
            setViewportSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
        const isPortrait = viewportSize.width < viewportSize.height;
        let cols, rows;
        if (isPortrait) {
            // Squeezed narrow screen: use 3 columns, more rows to fit screen vertically
            cols = 3;
            rows = Math.ceil(photos.length / cols) || 1;
        } else {
            // Wide screen: use 5 columns, fewer rows
            cols = 5;
            rows = Math.ceil(photos.length / cols) || 1;
        }

        return photos.map((photo, i) => {
            // Assign to a grid cell
            const col = i % cols;
            const row = Math.floor(i / cols);

            // Safe Zone: Compress vertical/horizontal padding to prevent clipping on screen edges
            const cellWidth = 70 / cols;
            const cellHeight = 50 / rows;

            const baseLeft = 15 + (col * cellWidth);
            const baseTop = 25 + (row * cellHeight);

            // Use the photo id as seed for stable placement and sizes
            const seed = photo.id;
            const leftJitter = seededRandom(seed + '-left');
            const topJitter = seededRandom(seed + '-top');
            const delayVal = seededRandom(seed + '-delay');
            const sizeVal = seededRandom(seed + '-size');
            const rotateVal = seededRandom(seed + '-rotate');

            // Jitter randomly within its designated cell so it feels scattered but never clumps!
            const left = baseLeft + (leftJitter * (cellWidth * 0.7));
            const top = baseTop + (topJitter * (cellHeight * 0.7));
            
            // Random animation delay so they don't twinkle synchronously
            const delay = delayVal * 3 + 's';
            
            // Orbs from 35px to 60px
            const size = 35 + sizeVal * 25; 
            const rotation = `${rotateVal * 16 - 8}deg`; // -8 to +8 degrees rotation for polaroid effect
            
            // Classify edge zones: left 35% are 'left', right 65% are 'right', middle is 'center'
            const relativeLeft = left / 100;
            let horizontalAlign = 'center';
            if (relativeLeft < 0.35) {
                horizontalAlign = 'left';
            } else if (relativeLeft > 0.65) {
                horizontalAlign = 'right';
            }

            // Classify vertical zones: bottom 55% are 'near-bottom'
            const isNearBottom = top > 55;
            
            return {
                ...photo,
                position: { top: `${top.toFixed(2)}%`, left: `${left.toFixed(2)}%` },
                style: { 
                    animationDelay: delay, 
                    width: `${size.toFixed(2)}px`, 
                    height: `${size.toFixed(2)}px`,
                    '--rotation': rotation 
                },
                horizontalAlign,
                isNearBottom
            };
        });
    }, [photos, viewportSize]);

    // Generate random background purely aesthetic stars
    const bgStars = useMemo(() => {
        const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
        const count = isTouch ? 40 : 150;
        const arr = [];
        for (let i = 0; i < count; i++) {
            const seed = `bg-star-${i}`;
            const topVal = seededRandom(seed + '-top');
            const leftVal = seededRandom(seed + '-left');
            const sizeVal = seededRandom(seed + '-size');
            const delayVal = seededRandom(seed + '-delay');
            const driftVal = seededRandom(seed + '-drift');

            arr.push({
                id: i,
                top: `${(topVal * 100).toFixed(2)}%`,
                left: `${(leftVal * 100).toFixed(2)}%`,
                size: `${(sizeVal * 2 + 1).toFixed(2)}px`,
                delay: `${(delayVal * 5).toFixed(2)}s`,
                driftDelay: `-${(driftVal * 60).toFixed(2)}s`
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

    // Detect touch device once at mount (using lazy state initialization to comply with React 19 safety)
    const [isTouchDevice] = useState(() => {
        return typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    });

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

        // Mouse-only parallax: only used on non-touch devices
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;
            targetRef.current = { x: x * -90, y: y * -40 };
        };

        // Gyroscope parallax variables for low-pass filter (smoothing)
        let lastX = 0;
        let lastY = 0;

        // Gyroscope parallax: primary parallax driver on touch/mobile devices
        const handleGyroscope = (e) => {
            if (e.gamma == null || e.beta == null) return;
            
            // Normalize inputs
            let targetX = e.gamma / 30;
            let targetY = (e.beta - 45) / 30;
            
            targetX = Math.max(-1, Math.min(1, targetX));
            targetY = Math.max(-1, Math.min(1, targetY));
            
            // Low-pass filter (90% previous, 10% new) to smooth out raw sensor noise
            lastX = lastX * 0.9 + targetX * 0.1;
            lastY = lastY * 0.9 + targetY * 0.1;
            
            // Scale down movement bounds on mobile to prevent GPU performance hits
            targetRef.current = { x: lastX * -30, y: lastY * -15 };
        };

        // On touch devices: use gyroscope for parallax — do NOT use touchmove
        // (touchmove interferes with star taps and causes janky pan-and-zoom conflicts)
        if (isTouchDevice) {
            window.addEventListener('deviceorientation', handleGyroscope);
        } else {
            window.addEventListener('mousemove', handleMouseMove);
        }
        
        requestRef.current = requestAnimationFrame(updateParallax);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('deviceorientation', handleGyroscope);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            document.head.removeChild(meta); 
        };
    }, [isTouchDevice]);

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
                            className={`memory-star-wrapper ${star.isNearBottom ? 'near-bottom' : 'near-top'} align-${star.horizontalAlign}`}
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
                                // Mouse hover only applies on non-touch devices to avoid ghost events
                                onMouseEnter={!isTouchDevice ? () => setActiveStarId(star.id) : undefined}
                                onMouseLeave={!isTouchDevice ? () => setActiveStarId(null) : undefined}
                                onClick={(e) => handleStarClick(e, star.id)}
                            >
                                <div className="memory-preview">
                                    <div className="memory-preview-img-wrapper">
                                        {star.images && star.images[0] && (
                                            <img 
                                                src={star.images[0]} 
                                                alt={star.title}
                                                loading="lazy"
                                                decoding="async"
                                                onContextMenu={(e) => e.preventDefault()} // Disable right-click saving
                                                onDragStart={(e) => e.preventDefault()} // Disable drag-and-drop saving
                                                style={{ userSelect: 'none', WebkitUserDrag: 'none' }} // Disable selection
                                            />
                                        )}
                                    </div>
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

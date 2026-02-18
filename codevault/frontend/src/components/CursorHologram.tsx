import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Zap, Box, Code2 } from 'lucide-react';

export const CursorHologram: React.FC = () => {
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const { left, top, width, height } = containerRef.current.getBoundingClientRect();
            const x = (e.clientX - (left + width / 2)) / 15;
            const y = (e.clientY - (top + height / 2)) / 15;
            setCoords({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative w-64 h-64 flex items-center justify-center perspective-1000"
            style={{ perspective: '1000px' }}
        >
            <div
                className="relative transition-transform duration-200 ease-out preserve-3d"
                style={{
                    transform: `rotateX(${-coords.y}deg) rotateY(${coords.x}deg)`,
                    transformStyle: 'preserve-3d'
                }}
            >
                {/* Main Hologram Body */}
                <div className="relative z-10 p-10 bg-black dark:bg-white border-4 border-white dark:border-black animate-pulse shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                    <Code2 className="w-24 h-24 text-white dark:text-black stroke-[1.5]" />
                </div>

                {/* Floating Elements around it */}
                <div
                    className="absolute -top-10 -right-10 p-4 bg-red-600 text-white transform translate-z-20"
                    style={{ transform: 'translateZ(40px)' }}
                >
                    <Zap className="w-8 h-8 fill-current" />
                </div>

                <div
                    className="absolute -bottom-8 -left-8 p-4 bg-black dark:bg-white border-2 border-white dark:border-black transform translate-z-[-20px]"
                    style={{ transform: 'translateZ(-30px)' }}
                >
                    <Cpu className="w-6 h-6 text-white dark:text-black" />
                </div>

                {/* Decorative Grid Plane */}
                <div
                    className="absolute inset-0 border border-white/20 dark:border-black/20 transform translate-z-[-50px] scale-150"
                    style={{
                        transform: 'translateZ(-50px) scale(1.5)',
                        backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }}
                />
            </div>
        </div>
    );
};

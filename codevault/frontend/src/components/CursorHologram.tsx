import React, { useState, useEffect, useRef } from 'react';
import { Code2, Zap, Cpu, Database, Shield, Box as BoxIcon } from 'lucide-react';

export const CursorHologram: React.FC = () => {
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const { left, top, width, height } = containerRef.current.getBoundingClientRect();
            // Calculate relative position from center (-0.5 to 0.5)
            const x = (e.clientX - (left + width / 2)) / (width / 2);
            const y = (e.clientY - (top + height / 2)) / (height / 2);

            // Limit rotation to a reasonable range
            setCoords({
                x: x * 25, // Max 25 degrees
                y: y * 25
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const faces = [
        { icon: <Code2 className="w-12 h-12" />, label: "VAULT", transform: "translateZ(60px)" }, // Front
        { icon: <Zap className="w-12 h-12" />, label: "CORE", transform: "rotateY(180deg) translateZ(60px)" }, // Back
        { icon: <Cpu className="w-12 h-12" />, label: "LOGIC", transform: "rotateY(90deg) translateZ(60px)" }, // Right
        { icon: <Database className="w-12 h-12" />, label: "DATA", transform: "rotateY(-90deg) translateZ(60px)" }, // Left
        { icon: <Shield className="w-12 h-12" />, label: "SECURE", transform: "rotateX(90deg) translateZ(60px)" }, // Top
        { icon: <BoxIcon className="w-12 h-12" />, label: "GRID", transform: "rotateX(-90deg) translateZ(60px)" }, // Bottom
    ];

    return (
        <div
            ref={containerRef}
            className="relative w-64 h-64 flex items-center justify-center"
            style={{ perspective: '1200px' }}
        >
            {/* The 3D Cube Container */}
            <div
                className="relative w-32 h-32 transition-transform duration-300 ease-out"
                style={{
                    transformStyle: 'preserve-3d',
                    transform: `rotateX(${-coords.y}deg) rotateY(${coords.x}deg)`
                }}
            >
                {/* Cube Faces */}
                {faces.map((face, i) => (
                    <div
                        key={i}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-black dark:bg-white border-2 border-white dark:border-black text-white dark:text-black backface-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        style={{
                            transform: face.transform,
                            backfaceVisibility: 'hidden',
                            opacity: 0.95
                        }}
                    >
                        <div className="animate-pulse">
                            {face.icon}
                        </div>
                        <span className="text-[8px] font-black tracking-[0.3em] mt-2 opacity-50 uppercase italic">
                            {face.label}
                        </span>

                        {/* Decorative HUD Lines */}
                        <div className="absolute inset-2 border border-white/10 dark:border-black/10 pointer-events-none" />
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-red-600" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-600" />
                    </div>
                ))}

                {/* Internal Glow Core */}
                <div
                    className="absolute inset-4 bg-red-600/20 blur-xl animate-pulse rounded-full"
                    style={{ transform: 'translateZ(0px)' }}
                />
            </div>

            {/* Distant HUD Grid Overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    transform: `rotateX(${-coords.y * 0.5}deg) rotateY(${coords.x * 0.5}deg) translateZ(-100px) scale(1.5)`,
                    backgroundImage: 'linear-gradient(to right, #444 1px, transparent 1px), linear-gradient(to bottom, #444 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(circle, black, transparent 80%)'
                }}
            />

            {/* Floating Coordinate HUD */}
            <div
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-mono text-white/40 dark:text-black/40 flex gap-4 uppercase"
                style={{ transform: `rotateX(${-coords.y * 0.2}deg) rotateY(${coords.x * 0.2}deg)` }}
            >
                <span>X-ROT: {Math.round(coords.x)}°</span>
                <span>Y-ROT: {Math.round(coords.y)}°</span>
            </div>
        </div>
    );
};

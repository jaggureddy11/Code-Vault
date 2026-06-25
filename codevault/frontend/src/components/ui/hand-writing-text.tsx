"use client";

import { motion } from "framer-motion";

interface HandWrittenTitleProps {
    title?: string;
    subtitle?: string;
    className?: string;
    titleClassName?: string;
    subtitleClassName?: string;
    contentClassName?: string;
    strokeWidth?: number;
}

function HandWrittenTitle({
    title = "Hand Written",
    subtitle = "Optional subtitle",
    className = "relative w-full max-w-4xl mx-auto py-24",
    titleClassName = "text-4xl md:text-6xl text-black dark:text-white tracking-tighter flex items-center gap-2",
    subtitleClassName = "text-xl text-black/80 dark:text-white/80",
    contentClassName = "relative text-center z-10 flex flex-col items-center justify-center",
    strokeWidth = 12,
}: HandWrittenTitleProps) {
    const draw = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { 
                    duration: 2.5, 
                    ease: [0.43, 0.13, 0.23, 0.96] as const,
                    repeat: Infinity,
                    repeatType: "reverse" as const,
                    repeatDelay: 1
                },
                opacity: { duration: 0.5 },
            },
        },
    };

    return (
        <div className={className}>
            <div className="absolute inset-0 pointer-events-none">
                <motion.svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 1200 600"
                    initial="hidden"
                    animate="visible"
                    className="w-full h-full"
                >
                    <title>R JAGADISHWAR REDDY</title>
                    <motion.path
                        d="M 950 90 
                           C 1250 300, 1050 480, 600 520
                           C 250 520, 150 480, 150 300
                           C 150 120, 350 80, 600 80
                           C 850 80, 950 180, 950 180"
                        fill="none"
                        strokeWidth={strokeWidth}
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        variants={draw}
                        className="text-black dark:text-white opacity-90"
                    />
                </motion.svg>
            </div>
            <div className={contentClassName}>
                <motion.h1
                    className={titleClassName}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    {title}
                </motion.h1>
                {subtitle && (
                    <motion.p
                        className={subtitleClassName}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.8 }}
                    >
                        {subtitle}
                    </motion.p>
                )}
            </div>
        </div>
    );
}

export { HandWrittenTitle };

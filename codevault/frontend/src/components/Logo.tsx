import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
    className?: string;
    showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className, showText = true }) => {
    return (
        <div className={cn("flex items-center group cursor-pointer", className)}>
            {showText && (
                <div className="flex flex-col">
                    <h1 className="text-2xl font-black text-black dark:text-white leading-none italic uppercase tracking-tighter">
                        CodeVault
                    </h1>
                </div>
            )}
        </div>
    );
};

import React from 'react';

interface LogoProps {
    className?: string;
    showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "", showText = true }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className="relative w-8 h-8 flex items-center justify-center">
                {/* Reactive Vector Logo - Abstract Deck Stack */}
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Background Card */}
                    <rect x="4" y="6" width="20" height="20" rx="4" transform="rotate(-15 14 16)" className="fill-accent/20 stroke-accent" strokeWidth="2" />

                    {/* Middle Card */}
                    <rect x="6" y="6" width="20" height="20" rx="4" transform="rotate(-5 16 16)" className="fill-surface stroke-text/50" strokeWidth="2" />

                    {/* Foreground Card with "F" hint */}
                    <rect x="8" y="6" width="20" height="20" rx="4" transform="rotate(5 18 16)" className="fill-accent stroke-accent" strokeWidth="0" />
                    <path d="M16 12H22M16 16H20M16 12V20" stroke="var(--color-bg)" strokeWidth="2.5" strokeLinecap="round" transform="rotate(5 18 16) translate(2, 0)" />
                </svg>
            </div>

            {showText && (
                <div className="flex flex-col">
                    <span className="font-bold text-lg tracking-tight leading-none text-text">FontDeck</span>
                </div>
            )}
        </div>
    );
};

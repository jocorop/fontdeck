import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';
import { Search, RotateCcw, Sun, Moon, Info } from 'lucide-react';

export const TopBar: React.FC = () => {
    const { t } = useTranslation();
    const {
        previewText, previewSize, setPreviewText, setPreviewSize,
        searchTerm, setSearchTerm, accentColor, setAccentColor,
        theme, setTheme, locale, setLocale, toggleInfo
    } = useStore();

    const [localSize, setLocalSize] = useState(previewSize);
    const [showPalette, setShowPalette] = useState(false);

    // Sync local size with store size when store changes externally (e.g. reset)
    React.useEffect(() => {
        setLocalSize(previewSize);
    }, [previewSize]);

    // Debounce updates to store
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (localSize !== previewSize) {
                setPreviewSize(localSize);
            }
        }, 50); // 50ms debounce
        return () => clearTimeout(timer);
    }, [localSize, setPreviewSize, previewSize]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="h-14 bg-surface border-b border-black flex items-center px-4 shrink-0 space-x-4">
            {/* Search */}
            <div className="relative w-64 group shrink-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted group-hover:text-text" size={16} />
                <input
                    type="text"
                    placeholder={t('topbar.search')}
                    className="w-full bg-background/50 border border-transparent focus:border-accent rounded h-9 pl-10 pr-4 text-sm text-text focus:outline-none placeholder-muted/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4 px-4 border-r border-surface/50 h-8 shrink-0 relative">

                {/* Color Palette Toggle */}
                <div className="relative group">
                    <div
                        className="w-4 h-4 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-sm"
                        style={{ backgroundColor: accentColor }}
                        onClick={() => setShowPalette(!showPalette)}
                        title="Change Accent Color"
                    ></div>

                    {showPalette && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowPalette(false)}
                            ></div>
                            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-surface border border-text/10 p-2 rounded-lg shadow-xl grid grid-cols-3 gap-2 z-50 w-24">
                                {['#00E676', '#2979FF', '#D500F9', '#FF9100', '#FF1744', '#00BFA5'].map(color => (
                                    <div
                                        key={color}
                                        className="w-5 h-5 rounded-full cursor-pointer hover:scale-110 transition-transform border border-white/10"
                                        style={{ backgroundColor: color }}
                                        onClick={() => {
                                            setAccentColor(color);
                                            setShowPalette(false);
                                        }}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="h-4 w-[1px] bg-text/10 mx-2"></div>

                {/* Theme Toggle */}
                <div onClick={toggleTheme} className="cursor-pointer group" title="Toggle Theme">
                    {theme === 'dark' ?
                        <Sun size={18} className="text-muted hover:text-text transition-colors" /> :
                        <Moon size={18} className="text-muted hover:text-text transition-colors" />
                    }
                </div>

                <div className="h-4 w-[1px] bg-text/10 mx-2"></div>

                {/* Locale Toggle */}
                <button
                    onClick={() => setLocale(locale === 'en' ? 'es' : 'en')}
                    className="text-xs font-bold text-muted hover:text-text uppercase px-2 py-1 border border-transparent hover:border-muted rounded"
                >
                    {locale}
                </button>

                <div className="h-4 w-[1px] bg-text/10 mx-2"></div>

                {/* Info Button */}
                <button
                    onClick={toggleInfo}
                    className="p-1.5 rounded-md text-muted hover:text-accent hover:bg-white/5 transition-colors"
                >
                    <Info size={18} />
                </button>

                <div className="h-4 w-[1px] bg-text/10 mx-2"></div>

                {/* Size Slider */}
                <div className="flex items-center space-x-2 group relative">
                    <span className="text-[10px] text-muted uppercase font-bold tracking-wider">{t('topbar.size')}</span>
                    <input
                        type="range"
                        min="8"
                        max="120"
                        value={localSize}
                        onChange={(e) => setLocalSize(Number(e.target.value))}
                        className="w-24 accent-accent h-1 bg-text/20 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                <div className="flex items-center justify-end w-10 opacity-50 group-hover:opacity-100 transition-opacity">
                    <input
                        type="number"
                        min="8"
                        max="200"
                        value={localSize}
                        onChange={(e) => setLocalSize(Number(e.target.value))}
                        className="text-text font-mono text-xs w-full text-right bg-transparent border-none outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none p-0 m-0"
                    />
                    <span className="text-text font-mono text-xs ml-[1px]">px</span>
                </div>

                <div title="Reset view">
                    <RotateCcw
                        size={16}
                        className="text-muted hover:text-text cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => { setPreviewSize(32); setPreviewText("The quick fox jumps over the lazy dog"); }}
                    />
                </div>
            </div>

            {/* Global Preview Input - Expanded */}
            <div className="flex-1 flex items-center pl-2">
                <input
                    type="text"
                    value={previewText}
                    onChange={(e) => setPreviewText(e.target.value)}
                    className="w-full bg-background/50 border border-transparent focus:border-accent rounded h-9 px-4 text-sm text-text focus:outline-none placeholder-muted/50"
                    placeholder={t('topbar.preview_placeholder')}
                />
            </div>
        </div>
    );
};

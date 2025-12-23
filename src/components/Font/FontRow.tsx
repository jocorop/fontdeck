import React, { useMemo } from 'react';
import type { FontData } from '../../types';
import { useStore } from '../../store/useStore';
import { Heart } from 'lucide-react';

interface FontRowProps {
    font: FontData;
    style: React.CSSProperties;
    hideMetadata?: boolean;
}

export const FontRow: React.FC<FontRowProps> = ({ font, style, hideMetadata }) => {
    const { previewText, previewSize, toggleFavorite, favorites, openContextMenu } = useStore();
    const isFav = favorites.includes(font.id);

    const fontStyle = useMemo(() => {
        const subfamily = font.metadata.subfamily.toLowerCase();
        let fontWeight = 'normal';
        let fontStyle = 'normal';

        if (subfamily.includes('bold')) fontWeight = 'bold';
        if (subfamily.includes('thin')) fontWeight = '100';
        if (subfamily.includes('extra light') || subfamily.includes('extralight')) fontWeight = '200';
        if (subfamily.includes('light')) fontWeight = '300';
        if (subfamily.includes('medium')) fontWeight = '500';
        if (subfamily.includes('semibold') || subfamily.includes('semi bold')) fontWeight = '600';
        if (subfamily.includes('extra bold') || subfamily.includes('extrabold')) fontWeight = '800';
        if (subfamily.includes('black') || subfamily.includes('heavy')) fontWeight = '900';

        if (subfamily.includes('italic') || subfamily.includes('oblique')) fontStyle = 'italic';

        return {
            fontFamily: `"${font.metadata.family}", "${font.metadata.fullName}", "${font.metadata.postscriptName}", sans-serif`,
            fontWeight,
            fontStyle
        };
    }, [font]);

    return (
        <div
            style={style}
            className="border-b border-surface hover:bg-surface/50 transition-colors px-6 flex flex-col justify-center group relative cursor-move"
            onDragStart={(e) => {
                e.dataTransfer.setData("fontId", font.id);
                e.dataTransfer.effectAllowed = "copy";
            }}
            onContextMenu={(e) => {
                e.preventDefault();
                openContextMenu(e.clientX, e.clientY, font.id, 'font');
            }}
        >
            {!hideMetadata && (
                <div className="flex items-center text-muted text-xs mb-2 space-x-3">
                    {/* Favorite Toggle */}
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(font.id); }}
                        className={`transition-colors ${isFav ? 'text-accent' : 'text-muted hover:text-text'}`}
                        title="Toggle Favorite"
                    >
                        <Heart size={14} fill={isFav ? "currentColor" : "none"} />
                    </button>

                    <span className="font-semibold text-text">{font.metadata.family}</span>
                    <span className="opacity-70">{font.metadata.subfamily}</span>
                    <span className="bg-surface px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider text-muted">{font.metadata.format}</span>
                    {font.metadata.glyphCount ? <span className="opacity-50">{font.metadata.glyphCount} glyphs</span> : null}
                </div>
            )}

            <div
                className="text-text whitespace-nowrap overflow-hidden text-ellipsis w-full outline-none"
                style={{
                    ...fontStyle,
                    fontSize: `${previewSize}px`,
                    fontSize: `${previewSize}px`,
                    direction: isRTL(previewText) ? 'rtl' : 'ltr',
                    textAlign: isRTL(previewText) ? 'right' : 'left'
                }}
                contentEditable
                suppressContentEditableWarning
            >
                {previewText}
            </div>
        </div>
    );
};

const isRTL = (s: string) => {
    const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlChars.test(s);
};

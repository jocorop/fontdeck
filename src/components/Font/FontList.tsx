import React, { useMemo, useRef, useLayoutEffect, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { FamilyRow } from './FamilyRow';
import type { FontData } from '../../types';
import { useTranslation } from 'react-i18next';
import { Lobby } from '../UI/Lobby';

export const FontList: React.FC = () => {
    const { t } = useTranslation();
    const { filteredFonts, searchTerm, listScrollTop, setListScrollTop } = useStore();
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollPosRef = useRef(listScrollTop); // Track scroll position in a ref

    // Restore scroll position
    useLayoutEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = listScrollTop;

            // Backup restoration for slower renders
            requestAnimationFrame(() => {
                if (containerRef.current && containerRef.current.scrollTop !== listScrollTop) {
                    containerRef.current.scrollTop = listScrollTop;
                }
            });
        }
    }, []);

    // Save scroll position on unmount
    useEffect(() => {
        return () => {
            setListScrollTop(scrollPosRef.current);
        };
    }, [setListScrollTop]);

    const handleScroll = () => {
        if (containerRef.current) {
            scrollPosRef.current = containerRef.current.scrollTop;
        }
    };

    // Grouping Logic
    const groupedFonts = useMemo(() => {
        const groups: Record<string, FontData[]> = {};
        filteredFonts.forEach(font => {
            const family = font.metadata.family;
            if (!groups[family]) groups[family] = [];
            groups[family].push(font);
        });
        return groups;
    }, [filteredFonts]);

    const familyNames = Object.keys(groupedFonts).sort();

    return (
        <div
            ref={containerRef}
            className="flex-1 h-full bg-background relative overflow-y-auto overflow-x-hidden p-4"
            onScroll={handleScroll}
        >
            {filteredFonts.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center flex-col p-10 text-center z-10">
                    {searchTerm ? (
                        /* No Search Results */
                        <div className="animate-in fade-in zoom-in-95 duration-300">
                            <div className="text-6xl mb-4 opacity-20 text-accent">?</div>
                            <h2 className="text-2xl font-bold text-text mb-2">{t('sidebar.no_search_results')}</h2>
                            <p className="text-muted">{t('sidebar.no_search_message')}</p>
                        </div>
                    ) : (
                        /* Welcome / Empty Provider state with Game Lobby */
                        <Lobby />
                    )}
                </div>
            )}

            <div className="flex flex-col space-y-4">
                {familyNames.map((family) => (
                    <FamilyRow
                        key={family}
                        familyName={family}
                        variants={groupedFonts[family]}
                    />
                ))}
            </div>
        </div>
    );
};

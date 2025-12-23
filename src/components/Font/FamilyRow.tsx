import React from 'react';
import type { FontData } from '../../types';
import { FontRow } from './FontRow';
import { Circle } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface FamilyRowProps {
    familyName: string;
    variants: FontData[];
    style?: React.CSSProperties;
}

export const FamilyRow: React.FC<FamilyRowProps> = ({ familyName, variants }) => {
    const { setActiveView, setSelectedFamily } = useStore();

    // Pick a "representative" font for the family preview (preferably Regular)
    const representative = variants.find(v => v.metadata.subfamily === 'Regular') || variants[0];

    const handleOpenDetails = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedFamily(familyName);
        setActiveView('details');
    };

    return (
        <div className="flex flex-col">
            {/* Parent Row */}
            <div className="group flex flex-col relative" onClick={handleOpenDetails}>
                {/* Visual "Row" area */}
                <div className="flex items-center px-4 py-2 hover:bg-surface/50 transition-colors cursor-pointer select-none">

                    {/* Expand/Collapse Control - Now Navigates to Details */}
                    <div
                        className="mr-3 text-muted hover:text-text transition-colors cursor-pointer p-1"
                        onClick={handleOpenDetails}
                    >
                        <Circle size={18} />
                    </div>

                    {/* Content area: similar to FontRow but for Family */}
                    <div className="flex-1 flex flex-col min-w-0">
                        <div className="flex items-center space-x-2 text-muted mb-1">
                            <span className="font-bold text-text text-sm">{familyName}</span>
                            <span className="text-[10px] uppercase font-bold opacity-40 tracking-wider bg-surface px-1.5 rounded">{variants.length === 1 ? '1 style' : `${variants.length} styles`}</span>
                        </div>

                        {/* Preview using representative font */}
                        <div className="pointer-events-none opacity-80">
                            <FontRow font={representative} style={{}} hideMetadata />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Upload } from 'lucide-react';

interface DragOverlayProps {
    isVisible: boolean;
}

export const DragOverlay: React.FC<DragOverlayProps> = ({ isVisible }) => {
    const { t } = useTranslation();

    if (!isVisible) return null;

    return (
        <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200 pointer-events-none">
            <div className="bg-surface border border-white/10 rounded-2xl p-12 text-center shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col items-center gap-6">
                <div className="p-6 bg-accent/10 rounded-full animate-bounce">
                    <Upload size={64} className="text-accent" />
                </div>
                <h2 className="text-3xl font-bold text-text tracking-tight">{t('drop_here')}</h2>
            </div>
        </div>
    );
};

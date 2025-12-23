import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';
import { getConsentStatus, setConsentStatus } from '../services/db';
import { X, Save, ShieldAlert } from 'lucide-react';

export const ConsentBanner: React.FC = () => {
    const { t } = useTranslation();
    const { fonts } = useStore();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check consent on mount
        const status = getConsentStatus();
        if (status === 'unknown') {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        setConsentStatus('granted');
        setIsVisible(false);
        // Trigger save immediately if we already have fonts loaded in memory
        // Ideally, the store should react to this change, but for simplicity
        // we can just rely on the next add/remove action OR force a save here if we had access to saveFontsToDB.
        // Since we don't expose save directly to component, we rely on the store's effect or future actions.
        // Actually, we should probably tell the store to "enable persistence".
        window.location.reload(); // Simple way to force store to re-init with persistence enabled? Or just let it be.
        // Better: Just set flag. The next time they visit, it will work. 
        // OR: We can manually trigger a save if we import the service.
        import('../services/db').then(({ saveFontsToDB }) => {
            saveFontsToDB(fonts);
        });
    };

    const handleReject = () => {
        // Do not persist 'denied' so user can change their mind on next load
        setIsVisible(false);
    };

    const handleDismiss = () => {
        // Just hide for this session
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 max-w-sm bg-surface border border-accent/20 rounded-lg shadow-2xl p-4 flex flex-col gap-3 z-50 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-start gap-3">
                <div className="p-2 bg-accent/10 rounded-full text-accent shrink-0">
                    <ShieldAlert size={20} />
                </div>
                <div className="flex-1">
                    <p className="text-sm text-text leading-relaxed">
                        {t('consent.message')}
                    </p>
                </div>
                <button
                    onClick={handleDismiss}
                    className="text-muted hover:text-text transition-colors -mt-1 -mr-1 p-1"
                    aria-label="Customize"
                >
                    <X size={16} />
                </button>
            </div>

            <div className="flex gap-2 justify-end mt-1">
                <button
                    onClick={handleReject}
                    className="px-3 py-1.5 text-xs font-medium text-muted hover:text-red-400 transition-colors"
                >
                    {t('consent.reject')}
                </button>
                <button
                    onClick={handleAccept}
                    className="px-4 py-1.5 text-xs font-bold bg-accent text-black rounded hover:bg-accent/90 transition-colors flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,230,118,0.2)]"
                >
                    <Save size={12} />
                    {t('consent.accept')}
                </button>
            </div>
        </div>
    );
};

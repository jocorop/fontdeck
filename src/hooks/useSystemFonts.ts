import { useState, useCallback } from 'react';
import { useStore } from '../store/useStore';
import type { FontData } from '../types';
import { useTranslation } from 'react-i18next';

export const useSystemFonts = () => {
    const addFonts = useStore((state) => state.addFonts);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    const loadSystemFonts = useCallback(async () => {
        // @ts-ignore
        if (!window.queryLocalFonts) {
            const msg = t('sidebar.local_api_error');
            setError(msg);
            setTimeout(() => setError(null), 8000);
            return;
        }

        setLoading(true);
        try {
            // @ts-ignore
            const localFonts = await window.queryLocalFonts();

            const parsedFonts: FontData[] = localFonts.map((font: any) => ({
                id: `sys-${font.postscriptName}`,
                file: null as any,
                url: '',
                tags: ['local'],
                metadata: {
                    family: font.family,
                    subfamily: font.style,
                    fullName: font.fullName,
                    postscriptName: font.postscriptName,
                    format: 'System',
                    glyphCount: 0
                }
            }));

            addFonts(parsedFonts);

        } catch (err: any) {
            setError(err.message);
            setTimeout(() => setError(null), 8000);
        } finally {
            setLoading(false);
        }
    }, [addFonts, t]);

    return { loadSystemFonts, loading, error };
};

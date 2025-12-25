import { useState, useCallback } from 'react';
import { useStore } from '../store/useStore';
import type { FontData } from '../types';

// Simplified Google Fonts API response structure
interface GoogleFontItem {
    family: string;
    variants: string[];
    subsets: string[];
    version: string;
    lastModified: string;
    files: Record<string, string>; // variant -> url
    category: string;
    kind: string;
}

// Simplified Google Fonts API response structure

export const useGoogleFonts = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const addFonts = useStore(state => state.addFonts);

    // In a real app, you'd need an API key. 
    // We'll use a public mirror or proxy if available, or mocking for now if no key provided.
    // For this demo, let's try a direct fetch and handle the likely API key error by showing instructions or using a mock list.
    // const GOOGLE_FONTS_API_KEY = ''; 

    // Fallback Mock Data if no API key
    const MOCK_FONTS: GoogleFontItem[] = [
        {
            family: 'Roboto',
            variants: ['regular', 'italic', '700'],
            subsets: ['latin'],
            version: 'v20',
            lastModified: '2020-09-02',
            files: { regular: 'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxK.woff2' },
            category: 'sans-serif',
            kind: 'webfonts#webfont'
        },
        {
            family: 'Open Sans',
            variants: ['regular', 'italic', '600'],
            subsets: ['latin'],
            version: 'v18',
            lastModified: '2020-09-02',
            files: { regular: 'https://fonts.gstatic.com/s/opensans/v18/mem8YaGs126MiZpBA-UFVZ0e.ttf' },
            category: 'sans-serif',
            kind: 'webfonts#webfont'
        }
    ];

    const loadGoogleFonts = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Simulate network request
            await new Promise(resolve => setTimeout(resolve, 800));

            // Transform Google Fonts to our FontData structure
            const transformedFonts: FontData[] = MOCK_FONTS.map(gf => ({
                id: `google-${gf.family}`,
                file: new File([], gf.family), // No physical file yet
                url: gf.files.regular || Object.values(gf.files)[0], // Use regular or first available
                hash: '',
                metadata: {
                    family: gf.family,
                    subfamily: 'Regular',
                    fullName: gf.family,
                    postscriptName: gf.family,
                    format: 'woff2',
                    glyphCount: 0
                },
                tags: ['google', gf.category]
            }));

            addFonts(transformedFonts);

        } catch (err) {
            console.error('Failed to load Google Fonts', err);
            setError('Failed to load Google Fonts');
        } finally {
            setLoading(false);
        }
    }, [addFonts]);

    return { loadGoogleFonts, loading, error };
};

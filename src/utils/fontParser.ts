import opentype from 'opentype.js';
import type { FontData, FontMetadata } from '../types';
import { computeFileHash } from './hasher';

export const parseFontFile = async (file: File): Promise<FontData> => {
    return new Promise(async (resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (e) => {
            const buffer = e.target?.result as ArrayBuffer;

            // Calculate hash early
            const hash = await computeFileHash(buffer); // Use buffer for hashing as per hasher.ts signature

            // For WOFF2 we might skip deep parsing if it fails and just rely on browser rendering?
            // But the requirement says "Primary support: OTF, TTF, WOFF, WOFF2".

            let font: opentype.Font;
            try {
                font = opentype.parse(buffer);
            } catch (parseErr) {
                // Explicit check for unsupported render formats
                const fmt = getFontFormat(file.name);

                // Browsers can NOT render these list of formats natively
                if (['AFM', 'FEA', 'PFA', 'PFB', 'SFD', 'PT3', 'T42', 'TFM', 'VFB'].includes(fmt)) {
                    reject(new Error(`Format ${fmt} not supported`));
                    return;
                }

                console.warn("Opentype parsing failed (probably WOFF compression), using fallback metadata", parseErr);
                // Fallback for files Opentype.js can't read deeply (e.g. compressed WOFF2 without decompressor)
                // We can still try to render it.
                const fallbackMeta: FontMetadata = {
                    family: file.name,
                    subfamily: 'Regular',
                    fullName: file.name,
                    postscriptName: file.name,
                    format: fmt,
                    glyphCount: 0,
                    author: '', // Fallback: empty
                    copyright: '', // Fallback: empty
                    license: '', // Fallback: empty
                    supportedChars: [] // Fallback: empty, will use default ranges in view
                };

                const blob = new Blob([buffer], { type: file.type });
                const url = URL.createObjectURL(blob);
                const id = `${file.name}-${file.size}-${Date.now()}`;

                // Try to load it anyway
                loadFontToDocument(fallbackMeta.fullName, url);

                resolve({
                    id,
                    file,
                    url,
                    metadata: fallbackMeta,
                    tags: [], // Not system local
                    hash
                });
                return;
            }

            // If parsing was successful
            const metadata: FontMetadata = {
                family: getFontName(font, 'fontFamily'),
                subfamily: getFontName(font, 'fontSubfamily'),
                fullName: getFontName(font, 'fullName'),
                postscriptName: getFontName(font, 'postscriptName'),
                format: getFontFormat(file.name),
                glyphCount: font.numGlyphs,
                author: getFontName(font, 'designer'),
                copyright: getFontName(font, 'copyright'),
                license: getFontName(font, 'license'),
                supportedChars: getSupportedChars(font),
            };

            const blob = new Blob([buffer], { type: file.type });
            const url = URL.createObjectURL(blob);
            const id = `${metadata.postscriptName} -${file.size} -${Date.now()} `;

            // Register font to document for rendering
            loadFontToDocument(metadata.fullName, url);

            resolve({
                id,
                file,
                url,
                metadata,
                tags: [], // Not system local
                hash
            });

        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
};

// Helper to get name from localized name table safely
const getFontName = (font: opentype.Font, key: keyof opentype.FontNames): string => {
    const table = font.names[key];
    if (!table) return '';
    const raw = table.en || table['en-US'] || Object.values(table)[0] || '';
    return sanitizeString(raw);
}

// Security: Prevent massive strings or control characters in UI
const sanitizeString = (str: string): string => {
    if (!str) return '';
    // Remove control chars (0-31), trim, and limit length
    return str.replace(/[\x00-\x1F\x7F]/g, '').trim().substring(0, 500); // 500 chars max for names
}

const getFontFormat = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'ttf') return 'TTF';
    if (ext === 'otf') return 'OTF';
    if (ext === 'woff') return 'WOFF';
    if (ext === 'woff2') return 'WOFF2';
    if (ext === 'afm') return 'AFM';
    if (ext === 'fea') return 'FEA';
    if (ext === 'pfa') return 'PFA';
    if (ext === 'pfb') return 'PFB';
    if (ext === 'sfd') return 'SFD';
    if (ext === 'pt3') return 'PT3';
    if (ext === 't42') return 'T42';
    if (ext === 'tfm') return 'TFM';
    if (ext === 'vfb') return 'VFB';
    return 'UNKNOWN';
}

export const loadFontToDocument = async (fontName: string, url: string) => {
    try {
        const fontFace = new FontFace(fontName, `url(${url})`);
        // Add to document immediately to prevent FOUC (layout thrashing)
        document.fonts.add(fontFace);
        // Trigger load but don't wait for it to block execution
        await fontFace.load();
    } catch (e) {
        console.error(`Failed to load font ${fontName} `, e);
        // If it fails, we might want to remove it? 
        // But usually it just won't render.
    }
}

const getSupportedChars = (font: opentype.Font): number[] => {
    try {
        const cmap = font.tables.cmap.glyphIndexMap;
        if (!cmap) return [];

        // Extract all keys (unicodes), convert to number, sort
        return Object.keys(cmap).map(k => parseInt(k)).sort((a, b) => a - b);
    } catch (e) {
        console.warn("Failed to extract supported chars", e);
        return [];
    }
}

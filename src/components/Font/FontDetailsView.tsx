import React, { useMemo, useState } from 'react';
import { useStore } from '../../store/useStore';
import { FontRow } from './FontRow';
import { ArrowLeft, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const FontDetailsView: React.FC = () => {
    const { t } = useTranslation();
    const { fonts, selectedFamily, setActiveView, showToast, previewText } = useStore();
    const [activeTab, setActiveTab] = useState<'styles' | 'waterfall' | 'glyphs' | 'details'>('styles');

    const familyFonts = useMemo(() => {
        return fonts.filter(f => f.metadata.family === selectedFamily);
    }, [fonts, selectedFamily]);

    if (!selectedFamily || familyFonts.length === 0) {
        return <div className="p-10 text-center text-muted">{t('sidebar.family_not_found')}</div>;
    }

    const representative = familyFonts.find(f => f.metadata.subfamily === 'Regular') || familyFonts[0];

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could show toast here
    };

    return (
        <div className="h-full flex flex-col bg-background text-text overflow-hidden">
            {/* Header */}
            <div className="h-16 border-b border-surface flex items-center px-6 shrink-0 space-x-4">
                <button
                    onClick={() => setActiveView('list')}
                    className="p-2 hover:bg-surface rounded-full transition-colors"
                >
                    <ArrowLeft size={20} className="text-muted hover:text-text" />
                </button>

                <h1 className="text-2xl font-bold">{selectedFamily}</h1>
                <span className="text-muted text-sm border border-surface px-2 rounded-full">
                    {familyFonts.length} {t('details.styles_count')}
                </span>
            </div>

            {/* Tabs */}
            <div className="flex px-6 border-b border-surface space-x-6 shrink-0">
                <TabButton active={activeTab === 'styles'} label={t('details.styles')} onClick={() => setActiveTab('styles')} />
                <TabButton active={activeTab === 'waterfall'} label={t('details.waterfall')} onClick={() => setActiveTab('waterfall')} />
                <TabButton active={activeTab === 'glyphs'} label={t('details.glyphs')} onClick={() => setActiveTab('glyphs')} />
                <TabButton active={activeTab === 'details'} label={t('details.details_tab')} onClick={() => setActiveTab('details')} />
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 relative">
                {activeTab === 'styles' && (
                    <div className="space-y-4">
                        {familyFonts.map(font => (
                            <FontRow key={font.id} font={font} style={{}} />
                        ))}
                    </div>
                )}

                {activeTab === 'waterfall' && (
                    <div className="space-y-8">
                        {[72, 48, 36, 24, 18, 14].map(size => (
                            <div key={size} className="flex flex-col">
                                <div className="text-xs text-muted mb-1 text-right border-b border-surface/30 pb-1 font-mono">{size}px</div>
                                <div
                                    contentEditable
                                    suppressContentEditableWarning
                                    className="outline-none focus:ring-1 focus:ring-accent rounded px-2 min-h-[1.5em]"
                                    style={{
                                        fontFamily: `"${representative.metadata.family}", "${representative.metadata.fullName}", "${representative.metadata.postscriptName}", sans-serif`,
                                        fontSize: `${size}px`,
                                        fontWeight: representative.metadata.subfamily.toLowerCase().includes('bold') ? 'bold' : 'normal',
                                        fontStyle: representative.metadata.subfamily.toLowerCase().includes('italic') ? 'italic' : 'normal',
                                    }}
                                >
                                    {previewText || t('details.waterfall_sample')}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'glyphs' && (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-2 text-center pb-8">
                        {(() => {
                            // Determine which glyphs to show
                            let glyphsToShow: number[] = [];

                            if (representative.metadata.supportedChars && representative.metadata.supportedChars.length > 0) {
                                glyphsToShow = representative.metadata.supportedChars;
                            } else {
                                // Fallback: Basic Latin + Latin-1 Supplement + Hebrew + Currency
                                // We include a wide range because now we can filter accurately.
                                const basicLatin = Array.from({ length: 95 }, (_, i) => 32 + i);
                                const latin1 = Array.from({ length: 96 }, (_, i) => 160 + i);
                                const hebrew = Array.from({ length: 112 }, (_, i) => 0x0590 + i);
                                const currency = [0x20AC, 0x20A9, 0x20AA, 0x20AB];

                                const candidates = [...basicLatin, ...latin1, ...hebrew, ...currency];

                                // Filter using strict Canvas 2D measurement
                                glyphsToShow = candidates.filter(code => {
                                    const char = String.fromCharCode(code);
                                    return isGlyphSupported(char, representative.metadata.family);
                                });
                            }

                            // If too many, maybe virtualize? But for ~300 it's fine.
                            if (glyphsToShow.length > 2000) {
                                glyphsToShow = glyphsToShow.slice(0, 2000);
                            }

                            if (glyphsToShow.length === 0) {
                                return <div className="col-span-full text-center text-muted p-4">No printable glyphs found in range.</div>;
                            }

                            return glyphsToShow.map((code) => (
                                <div
                                    key={code}
                                    onClick={() => {
                                        const char = String.fromCharCode(code);
                                        copyToClipboard(char);
                                        showToast(t('sidebar.clipboard_copied'));
                                    }}
                                    className="aspect-square flex flex-col items-center justify-center border border-surface hover:bg-surface/30 cursor-pointer transition-colors group relative rounded"
                                    title={`${t('details.click_to_copy')} (U+${code.toString(16).toUpperCase()})`}
                                >
                                    <span className="text-2xl mb-1" style={{ fontFamily: `"${representative.metadata.family}", "${representative.metadata.fullName}", "${representative.metadata.postscriptName}", sans-serif` }}>
                                        {String.fromCharCode(code)}
                                    </span>
                                    <span className="text-[8px] text-muted opacity-0 group-hover:opacity-100 absolute bottom-1 font-mono">
                                        {code.toString(16).toUpperCase()}
                                    </span>
                                </div>
                            ));
                        })()}
                        {(!representative.metadata.supportedChars || representative.metadata.supportedChars.length === 0) && (
                            <div className="col-span-full pt-4 text-xs text-muted text-center italic">
                                {t('details.glyph_disclaimer')}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'details' && (
                    <div className="mx-auto pb-20">
                        <div className="grid grid-cols-2 gap-4">
                            <DetailCard label={t('details.labels.family')} value={representative.metadata.family} onClick={() => copyToClipboard(representative.metadata.family)} />
                            <DetailCard label={t('details.labels.subfamily')} value={representative.metadata.subfamily} onClick={() => copyToClipboard(representative.metadata.subfamily)} />
                            <DetailCard label={t('details.labels.fullname')} value={representative.metadata.fullName} onClick={() => copyToClipboard(representative.metadata.fullName)} />
                            <DetailCard label={t('details.labels.postscript')} value={representative.metadata.postscriptName} onClick={() => copyToClipboard(representative.metadata.postscriptName)} />
                            <DetailCard label={t('details.labels.format')} value={Array.from(new Set(familyFonts.map(f => f.metadata.format.toUpperCase()))).join(', ')} onClick={() => copyToClipboard(Array.from(new Set(familyFonts.map(f => f.metadata.format.toUpperCase()))).join(', '))} />
                            <DetailCard label={t('details.labels.version')} value={representative.metadata.version || 'Unknown'} onClick={() => copyToClipboard(representative.metadata.version || '')} />
                            <DetailCard label={t('details.labels.author')} value={representative.metadata.author || 'Unknown'} onClick={() => copyToClipboard(representative.metadata.author || '')} />
                            <DetailCard label={t('details.labels.glyphs_count')} value={representative.metadata.glyphCount?.toString() || '0'} onClick={() => copyToClipboard(representative.metadata.glyphCount?.toString() || '0')} />

                            <div className="col-span-2">
                                <DetailCard label={t('details.labels.copyright')} value={representative.metadata.copyright || 'Unknown'} onClick={() => copyToClipboard(representative.metadata.copyright || '')} />
                            </div>

                            {representative.metadata.license && (
                                <div className="col-span-2">
                                    <DetailCard label={t('details.labels.license')} value={representative.metadata.license} onClick={() => copyToClipboard(representative.metadata.license || '')} />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end mt-8">
                            <button
                                onClick={() => {
                                    const formats = Array.from(new Set(familyFonts.map(f => f.metadata.format.toUpperCase()))).join(', ');
                                    const text = `Font Family: ${representative.metadata.family}
Subfamily: ${representative.metadata.subfamily}
Full Name: ${representative.metadata.fullName}
Postscript Name: ${representative.metadata.postscriptName}
Format: ${formats}
Version: ${representative.metadata.version}
Glyphs: ${representative.metadata.glyphCount}
Copyright (c): ${representative.metadata.copyright || 'Unknown'}`;
                                    copyToClipboard(text);
                                    showToast(t('details.copied_to_clipboard'));
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-text/5 hover:bg-text/10 text-text rounded-lg transition-colors border border-text/10"
                            >
                                <Copy size={16} />
                                <span>{t('details.copy_details')}</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const TabButton: React.FC<{ active: boolean, label: string, onClick: () => void }> = ({ active, label, onClick }) => (
    <button
        onClick={onClick}
        className={`py-3 text-sm font-medium border-b-2 transition-colors ${active ? 'border-accent text-text' : 'border-transparent text-muted hover:text-text'}`}
    >
        {label}
    </button>
);

const DetailCard: React.FC<{ label: string, value: string, onClick?: () => void }> = ({ label, value, onClick }) => (
    <div
        onClick={onClick}
        className="bg-surface p-4 rounded-lg border border-white/5 hover:border-accent/50 cursor-pointer transition-colors group"
        title="Click to copy"
    >
        <span className="block text-xs uppercase tracking-wider text-muted mb-1 font-bold opacity-70 group-hover:text-accent transition-colors">{label}</span>
        <span className="block text-lg font-medium text-text select-all break-words">{value}</span>
    </div>
);

// Helpers for glyph detection
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const isGlyphSupported = (char: string, fontFamily: string): boolean => {
    if (!ctx) return false;

    // We check against multiple fallbacks to be sure the rendered width is unique to the target font.
    // If width(target + fallback) == width(fallback), then it's likely falling back.

    // We assume supported if AT LEAST ONE fallback comparison indicates a difference.
    // However, if the font is monospace, it might match monospace fallback width.
    // So we need to be careful. Ideally, it should differ from ALL fallbacks if it's a unique design,
    // OR differ from the one it doesn't look like.

    // A safer heuristic: It's supported if it differs from the GENERIC fallback (sans-serif)
    // AND if it differs from 'serif' (unless it's a serif font that happens to match standard serif width).

    // Let's stick to the double-check:
    const baseFont = '12px sans-serif';
    const checkFont = `12px "${fontFamily}", sans-serif`;

    ctx.font = baseFont;
    const refWidth = ctx.measureText(char).width;

    ctx.font = checkFont;
    const targetWidth = ctx.measureText(char).width;

    if (refWidth !== targetWidth) return true; // Difference from sans-serif -> Supported

    // If it matched sans-serif, maybe it IS a sans-serif font that happens to have same width?
    // Check serif.
    const baseSerif = '12px serif';
    const checkSerif = `12px "${fontFamily}", serif`;

    ctx.font = baseSerif;
    const refWidthSerif = ctx.measureText(char).width;

    ctx.font = checkSerif;
    const targetWidthSerif = ctx.measureText(char).width;

    if (refWidthSerif !== targetWidthSerif) return true; // Difference from serif -> Supported

    // If matches both, it's likely failing to render and falling back to browser defaults for both.
    return false;
};

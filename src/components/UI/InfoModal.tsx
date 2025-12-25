import React, { useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { useTranslation } from 'react-i18next';
import { X, Github, Coffee } from 'lucide-react';

const CHANGELOG_DATA = [
    {
        version: "v0.8.0",
        date: "2025-12-23",
        title: "Security, Anti-Tamper & SEO",
        changes: [
            { type: "security", text: "Anti-Tamper: No Source Maps / No Logs" },
            { type: "security", text: "DoS Protection (20MB Limit)" },
            { type: "feat", text: "SEO: JSON-LD, Social Cards, PWA Tags" },
            { type: "fix", text: "Localized & Auto-Dismiss Errors" },
            { type: "ui", text: "Light Mode Contrast Fixes" }
        ]
    },
    {
        version: "v0.7.9",
        date: "2025-12-23",
        title: "Drag & Drop & UX Polish",
        changes: [
            { type: "feat", text: "Global Interactive Drag & Drop Overlay" },
            { type: "fix", text: "Robust Scroll Position Memory" },
            { type: "fix", text: "Corrected Spanish Translations" },
            { type: "ui", text: "Theme-adaptive Drop Zone" }
        ]
    },
    {
        version: "v0.7.7",
        date: "2025-12-23",
        title: "Deduplication & Smart Notifications",
        changes: [
            { type: "security", text: "Strict Content Deduplication (SHA-256)" },
            { type: "feat", text: "Smart Error Notifications (Aggregated)" },
            { type: "feat", text: "Extended Format Support (AFM, PFA, SFD...)" },
            { type: "fix", text: "File Verification & Startup Crash" },
            { type: "fix", text: "Bug Fix: Duplicate Error Counts" }
        ]
    },
    {
        version: "v0.7.5",
        date: "2025-12-23",
        title: "Format Support & Polish",
        changes: [
            { type: "feat", text: "Extended File Support (AFM, PFA, SFD...)" },
            { type: "fix", text: "RTL Text Alignment & Overflow" },
            { type: "fix", text: "Font Preview Style Preservation" },
            { type: "fix", text: "Scroll Position Preservation" }
        ]
    },
    {
        version: "v0.7.1",
        date: "2025-12-23",
        title: "Rendering & UI Polish",
        changes: [
            { type: "fix", text: "Waterfall/Glyphs Font Rendering" },
            { type: "feat", text: "Editable Font Size Input" },
            { type: "ui", text: "Seamless Input Styling" }
        ]
    },
    {
        version: "v0.7.0",
        date: "2025-12-19",
        title: "Interactive Lobby & Polish",
        changes: [
            { type: "feat", text: "Interactive Lobby (Memory Game)" },
            { type: "feat", text: "Ko-fi Integration & Support" },
            { type: "feat", text: "Reactive Blur Effects" },
            { type: "fix", text: "Light Mode Contrast Fixes" },
            { type: "feat", text: "Full Localization (EN/ES)" }
        ]
    },
    {
        version: "v0.6.0",
        date: "2025-12-18",
        title: "Security & Stability Update",
        changes: [
            { type: "security", text: "DoS Prevention (Batched Loading)" },
            { type: "security", text: "XSS Hardening (CSP)" },
            { type: "security", text: "Input Validation (Accent Color)" },
            { type: "fix", text: "Startup Flash (Stabilized)" },
            { type: "fix", text: "Font Size Persistence" }
        ]
    },
    {
        version: "v0.5.0",
        date: "2025-12-18",
        title: "Refactoring & Optimization",
        changes: [
            { type: "feat", text: "Virtualization (React Window)" },
            { type: "feat", text: "Instant Startup (LocalStorage)" },
            { type: "chore", text: "Centralized Store Logic" }
        ]
    },
    {
        version: "v0.4.0",
        date: "2025-12-18",
        title: "Persistence & Collections",
        changes: [
            { type: "feat", text: "Collection Deletion" },
            { type: "feat", text: "UI Settings Persistence" },
            { type: "feat", text: "Collection Filtering" }
        ]
    }
];

export const InfoModal: React.FC = () => {
    const { isInfoOpen, toggleInfo } = useStore();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = React.useState<'changelog' | 'credits'>('changelog');

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isInfoOpen) toggleInfo();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isInfoOpen, toggleInfo]);

    if (!isInfoOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-surface border border-white/10 shadow-2xl rounded-xl w-[90%] max-w-2xl max-h-[85vh] flex flex-col overflow-hidden relative animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-background/50">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="text-accent">FontDeck</span>
                        <span className="opacity-50 text-sm font-normal">v0.8.0</span>
                    </h2>
                    <button
                        onClick={toggleInfo}
                        className="p-1 hover:bg-white/10 rounded transition-colors text-muted hover:text-text"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/5 bg-background/30">
                    <button
                        onClick={() => setActiveTab('changelog')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'changelog'
                            ? 'border-accent text-accent bg-accent/5'
                            : 'border-transparent text-muted hover:text-text hover:bg-white/5'
                            }`}
                    >
                        {t('info.changelog')}
                    </button>
                    <button
                        onClick={() => setActiveTab('credits')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'credits'
                            ? 'border-accent text-accent bg-accent/5'
                            : 'border-transparent text-muted hover:text-text hover:bg-white/5'
                            }`}
                    >
                        {t('info.credits')}
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-background/50 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {activeTab === 'changelog' ? (
                        <div className="space-y-6">
                            {CHANGELOG_DATA.map((release, i) => (
                                <div key={i} className="relative pl-4 border-l-2 border-white/10 pb-4 last:pb-0">
                                    <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-accent/50 ring-4 ring-surface" />
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-bold text-lg leading-none">{release.version}</h3>
                                        <span className="text-xs text-muted font-mono">{release.date}</span>
                                    </div>
                                    <p className="text-sm text-text/80 mb-3 font-medium">{release.title}</p>
                                    <ul className="space-y-1.5">
                                        {release.changes.map((change, j) => (
                                            <li key={j} className="text-xs text-muted flex items-start gap-2">
                                                <Badge type={change.type} />
                                                <span className="leading-relaxed">{change.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full space-y-8 py-8 text-center">

                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 rounded-full inline-flex mb-2">
                                    <Github size={48} className="text-text" />
                                </div>
                                <div>
                                    <p className="text-xs text-accent uppercase tracking-widest font-bold mb-1">{t('info.developed_by')}</p>
                                    <h3 className="text-2xl font-black text-text">@jocorop</h3>
                                    <a
                                        href="https://github.com/jocorop"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-muted hover:text-text transition-colors mt-2 inline-block hover:underline"
                                    >
                                        github.com/jocorop
                                    </a>
                                </div>
                            </div>

                            <div className="w-full h-px bg-white/5 max-w-[200px]" />

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted mb-4">{t('info.support')}</p>
                                    <a
                                        href="https://ko-fi.com/hadashnova"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-3 px-6 py-3 bg-[#FF5E5B] hover:bg-[#FF4542] text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg shadow-[#FF5E5B]/20"
                                    >
                                        <Coffee size={20} fill="white" />
                                        <span>{t('info.buy_coffee')}</span>
                                    </a>
                                </div>
                                <div className="pt-4">
                                    <a href="https://github.com/jocorop/fontdeck/blob/main/LICENSE" target="_blank" rel="noreferrer" className="text-[10px] text-muted hover:text-text transition-colors opacity-60">
                                        Open source software licensed under AGPL v3.0.
                                    </a>
                                </div>
                            </div>

                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/5 flex justify-end bg-background/50">
                    <button
                        onClick={toggleInfo}
                        className="px-4 py-2 hover:bg-white/5 rounded text-sm text-muted hover:text-text transition-colors"
                    >
                        {t('info.close')}
                    </button>
                </div>

            </div>
        </div >
    );
};

const Badge: React.FC<{ type: string }> = ({ type }) => {
    let color = "bg-gray-500/20 text-gray-400";
    if (type === "feat") color = "bg-blue-500/20 text-blue-400";
    if (type === "fix") color = "bg-green-500/20 text-green-400";
    if (type === "security") color = "bg-red-500/20 text-red-400";

    return (
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wide font-bold min-w-[50px] text-center ${color}`}>
            {type}
        </span>
    );
};

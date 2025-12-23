import React from 'react';
import { useTranslation } from 'react-i18next';
import { Github, ArrowLeft } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface CreditsProps {
    onBack: () => void;
}

export const LobbyCredits: React.FC<CreditsProps> = ({ onBack }) => {
    const { t } = useTranslation();
    const { accentColor } = useStore();

    return (
        <div className="flex flex-col items-center justify-center h-full w-full animate-in zoom-in-90 duration-500">
            <h2 className="text-3xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-text to-text/50">
                {t('info.excellent')}
            </h2>
            <p className="text-muted mb-8 text-sm">{t('info.typography_eye')}</p>

            <div className="bg-surface/50 border border-text/10 p-8 rounded-2xl backdrop-blur-sm shadow-2xl max-w-sm w-full text-center space-y-8 relative overflow-hidden transition-all duration-500 hover:backdrop-blur-md hover:scale-[1.02] hover:shadow-accent/10 group">

                {/* Accent Glow */}
                <div
                    className="absolute top-0 left-0 w-full h-1 opacity-50"
                    style={{ backgroundColor: accentColor }}
                />

                <div className="space-y-4">
                    <div className="p-4 bg-text/5 rounded-full inline-flex mb-2 animate-bounce">
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

                <div className="w-full h-px bg-text/5 mx-auto max-w-[150px]" />

                <div className="space-y-4">
                    <div>
                        <a
                            href="https://ko-fi.com/hadashnova"
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-muted mb-4 hover:text-text transition-colors block hover:underline"
                        >
                            {t('info.support')}
                        </a>
                        <a
                            href="https://ko-fi.com/hadashnova"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block hover:scale-105 transition-transform"
                        >
                            <img
                                src="https://ko-fi.com/img/githubbutton_sm.svg"
                                alt={t('info.buy_coffee')}
                                className="h-10"
                            />
                        </a>
                    </div>
                </div>
            </div>

            <button
                onClick={onBack}
                className="mt-8 flex items-center gap-2 text-muted hover:text-text transition-colors text-sm px-4 py-2 hover:bg-text/5 rounded-full"
            >
                <ArrowLeft size={14} />
                <span>{t('info.back_to_lobby')}</span>
            </button>
        </div>
    );
};

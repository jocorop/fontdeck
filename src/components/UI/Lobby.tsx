import React, { useState } from 'react';
import { EyeFollower } from './EyeFollower';
import { FontMemoryGame } from './FontMemoryGame';
import { LobbyCredits } from './LobbyCredits';
import { useTranslation } from 'react-i18next';
import { Play } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const Lobby: React.FC = () => {
    const [view, setView] = useState<'idle' | 'game' | 'credits'>('idle');
    const { t } = useTranslation();
    useStore();

    return (
        <div className="absolute inset-0 flex items-center justify-center flex-col p-10 text-center overflow-hidden">

            {view === 'idle' && (
                <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center">
                    <div
                        className="flex flex-col items-center justify-center space-y-4 mb-6 opacity-100 cursor-pointer group"
                        onClick={() => setView('game')}
                    >
                        <div className="scale-125 group-hover:scale-110 transition-transform duration-300">
                            <EyeFollower />
                        </div>
                        <span className="text-6xl font-black tracking-tighter text-text group-hover:text-accent transition-colors duration-300">
                            FontDeck
                        </span>
                    </div>

                    <p className="text-xl text-muted max-w-md mx-auto leading-relaxed mb-8">
                        {t('sidebar.welcome_message')}
                    </p>

                    <button
                        onClick={() => setView('game')}
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-surface border border-white/10 hover:border-accent/50 hover:bg-white/5 transition-all text-sm font-medium text-muted hover:text-text group"
                    >
                        <Play size={14} className="fill-current" />
                        <span>{t('sidebar.play_game')}</span>
                    </button>
                </div>
            )}

            {view === 'game' && (
                <div className="w-full flex flex-col items-center">
                    <h3 className="text-muted mb-4 font-mono text-sm uppercase tracking-widest opacity-50">{t('sidebar.match_typefaces')}</h3>
                    <FontMemoryGame onWin={() => setView('credits')} />
                    <button
                        onClick={() => setView('idle')}
                        className="mt-8 text-xs text-muted/50 hover:text-muted transition-colors"
                    >
                        {t('sidebar.cancel')}
                    </button>
                </div>
            )}

            {view === 'credits' && (
                <LobbyCredits onBack={() => setView('idle')} />
            )}

        </div>
    );
};

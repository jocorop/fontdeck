import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore'; // For accent color
import { Loader2 } from 'lucide-react';

interface GameProps {
    onWin: () => void;
}

interface Card {
    id: number;
    fontFamily: string;
    isFlipped: boolean;
    isMatched: boolean;
    content: string;
}

const FONTS = [
    'Times New Roman',
    'Arial',
    'Courier New',
    'Georgia',
    'Verdana',
    'Impact',
    'Comic Sans MS',
    'Trebuchet MS'
];

export const FontMemoryGame: React.FC<GameProps> = ({ onWin }) => {
    const { accentColor } = useStore();
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [isLocked, setIsLocked] = useState(false);

    // Initialize Game
    useEffect(() => {
        const initialCards: Card[] = [];
        const pairs = [...FONTS]; // 8 pairs

        // Create pairs
        pairs.forEach((font) => {
            initialCards.push({ id: Math.random(), fontFamily: font, isFlipped: false, isMatched: false, content: 'Aa' });
            initialCards.push({ id: Math.random(), fontFamily: font, isFlipped: false, isMatched: false, content: 'gG' });
        });

        // Shuffle
        initialCards.sort(() => Math.random() - 0.5);
        setCards(initialCards);
    }, []);

    // Check Win
    useEffect(() => {
        if (cards.length > 0 && cards.every(c => c.isMatched)) {
            setTimeout(onWin, 500);
        }
    }, [cards, onWin]);

    const handleCardClick = (index: number) => {
        if (isLocked || cards[index].isFlipped || cards[index].isMatched) return;

        const newCards = [...cards];
        newCards[index].isFlipped = true;
        setCards(newCards);

        const newFlipped = [...flippedIndices, index];
        setFlippedIndices(newFlipped);

        if (newFlipped.length === 2) {
            setIsLocked(true);
            const [firstIdx, secondIdx] = newFlipped;

            if (newCards[firstIdx].fontFamily === newCards[secondIdx].fontFamily) {
                // Match
                setTimeout(() => {
                    const matchedCards = [...cards];
                    matchedCards[firstIdx].isMatched = true;
                    matchedCards[secondIdx].isMatched = true;
                    // Keep them flipped
                    matchedCards[firstIdx].isFlipped = true;
                    matchedCards[secondIdx].isFlipped = true;
                    setCards(matchedCards);
                    setFlippedIndices([]);
                    setIsLocked(false);
                }, 500);
            } else {
                // No Match
                setTimeout(() => {
                    const resetCards = [...cards];
                    resetCards[firstIdx].isFlipped = false;
                    resetCards[secondIdx].isFlipped = false; // Reset ONLY the current pair
                    // Note: In React state batching, we need to be careful. 
                    // Reading from 'cards' (stale) might be an issue? 
                    // Using function update is safer:
                    setCards(prev => prev.map((c, i) =>
                        (i === firstIdx || i === secondIdx) ? { ...c, isFlipped: false } : c
                    ));
                    setFlippedIndices([]);
                    setIsLocked(false);
                }, 1000);
            }
        }
    };

    return (
        <div className="w-full max-w-md mx-auto aspect-square p-4 bg-white/5 rounded-2xl border border-white/10 animate-in zoom-in-50 duration-500">
            <div className="grid grid-cols-4 gap-3 h-full">
                {cards.map((card, index) => (
                    <div
                        key={card.id}
                        className={`relative w-full h-full cursor-pointer perspective-1000 group`}
                        onClick={() => handleCardClick(index)}
                    >
                        <div
                            className={`w-full h-full relative transition-all duration-500 transform-style-3d ${card.isFlipped ? 'rotate-y-180' : ''}`}
                            style={{ transformStyle: 'preserve-3d', transform: card.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                        >
                            {/* Front (Hidden) */}
                            <div
                                className="absolute inset-0 bg-surface border border-white/5 rounded-lg flex items-center justify-center backface-hidden group-hover:bg-white/10 transition-colors"
                                style={{ backfaceVisibility: 'hidden' }}
                            >
                                <div className="w-2 h-2 rounded-full bg-white/10" />
                            </div>

                            {/* Back (Revealed) */}
                            <div
                                className="absolute inset-0 bg-white text-black rounded-lg flex flex-col items-center justify-center backface-hidden shadow-xl"
                                style={{
                                    backfaceVisibility: 'hidden',
                                    transform: 'rotateY(180deg)',
                                    backgroundColor: card.isMatched ? accentColor : 'white', // Highlight match
                                    color: card.isMatched ? 'white' : 'black'
                                }}
                            >
                                <span style={{ fontFamily: card.fontFamily, fontSize: '1.5rem', lineHeight: 1 }}>
                                    {card.content}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

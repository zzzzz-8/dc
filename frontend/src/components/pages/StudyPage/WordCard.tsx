import React from 'react';
import { speak } from '../../../services/tts/pronunciation';
import type { Word } from '../../../types/models';

interface WordCardProps {
  word: Word;
  isFlipped: boolean;
  onFlip: () => void;
  onKnow: () => void;
  onDontKnow: () => void;
}

export const WordCard: React.FC<WordCardProps> = ({
  word,
  isFlipped,
  onFlip,
  onKnow,
  onDontKnow,
}) => {
  const handlePronounce = (e: React.MouseEvent, accent: 'US' | 'UK') => {
    e.stopPropagation();
    speak(word.word, accent);
  };

  return (
    <div className="flex flex-col items-center px-4">
      {/* Card container */}
      <div
        className="w-full aspect-[3/4] max-h-[420px] cursor-pointer"
        style={{ perspective: '800px' }}
        onClick={onFlip}
      >
        <div
          className={`relative w-full h-full transition-all duration-[0.3s] ease-in-out`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front - Word side */}
          <div
            className="absolute inset-0 bg-bg-secondary rounded-2xl shadow-card p-6 flex flex-col items-center justify-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <p className="text-3xl font-bold text-text-primary mb-4 font-english">
              {word.word}
            </p>
            {word.phonetic && (
              <p className="text-base text-text-secondary mb-4">
                /{word.phonetic}/
              </p>
            )}
            <div className="flex gap-4 mb-6">
              <button
                onClick={(e) => handlePronounce(e, 'US')}
                className="px-3 py-1.5 bg-primary-50 text-primary-600 rounded-lg text-sm hover:bg-primary-100"
              >
                🔊 美式
              </button>
              <button
                onClick={(e) => handlePronounce(e, 'UK')}
                className="px-3 py-1.5 bg-primary-50 text-primary-600 rounded-lg text-sm hover:bg-primary-100"
              >
                🔊 英式
              </button>
            </div>
            <p className="text-sm text-text-secondary mt-auto">点击卡片翻转查看释义</p>
          </div>

          {/* Back - Meaning side */}
          <div
            className="absolute inset-0 bg-bg-secondary rounded-2xl shadow-card p-6 flex flex-col items-center justify-center"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <p className="text-2xl font-bold text-text-primary mb-2">
              {word.word}
            </p>
            {word.partOfSpeech && (
              <p className="text-sm text-text-secondary mb-1">{word.partOfSpeech}</p>
            )}
            <p className="text-xl text-primary-600 font-medium mb-4">
              {word.meaning}
            </p>
            {word.example && (
              <div className="w-full p-3 bg-bg-tertiary rounded-lg mb-4">
                <p className="text-sm text-text-primary italic">{word.example}</p>
                {word.exampleTrans && (
                  <p className="text-xs text-text-secondary mt-1">{word.exampleTrans}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      {isFlipped && (
        <div className="flex gap-4 mt-6 w-full px-4">
          <button
            onClick={onDontKnow}
            className="flex-1 py-3 bg-error-bg text-error rounded-xl font-medium border border-error/20 hover:bg-red-50 active:scale-95 transition-all"
          >
            ❌ 不认识
          </button>
          <button
            onClick={onKnow}
            className="flex-1 py-3 bg-success-bg text-success rounded-xl font-medium border border-success/20 hover:bg-green-50 active:scale-95 transition-all"
          >
            ✅ 认识
          </button>
        </div>
      )}
    </div>
  );
};

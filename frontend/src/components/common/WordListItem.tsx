import React, { useState, useRef, useCallback } from 'react';
import { speak } from '../../services/tts/pronunciation';

interface WordListItemProps {
  word: { id: string; word: string; meaning: string; phonetic?: string; partOfSpeech?: string; example?: string; exampleTrans?: string };
  onKnow?: (wordId: string) => void;
  onDontKnow?: (wordId: string) => void;
  showActions?: boolean;
  rightContent?: React.ReactNode;
  stage?: number;
  errorCount?: number;
  isReview?: boolean;
  /** Selection mode: show ✓/✗ as toggles, parent handles submission */
  selectMode?: boolean;
  /** Currently selected status in selectMode */
  selected?: 'know' | 'dontknow' | null;
  /** Called when user toggles selection */
  onSelect?: (wordId: string, type: 'know' | 'dontknow') => void;
}

export const WordListItem: React.FC<WordListItemProps> = ({
  word,
  onKnow,
  onDontKnow,
  showActions = true,
  rightContent,
  stage,
  errorCount,
  isReview = false,
  selectMode = false,
  selected = null,
  onSelect,
}) => {
  const [showTranslation, setShowTranslation] = useState(false);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastClick = useRef(0);

  const handleClick = useCallback(() => {
    const now = Date.now();
    if (lastClick.current && now - lastClick.current < 300) {
      // Double click - toggle translation
      if (clickTimer.current) clearTimeout(clickTimer.current);
      setShowTranslation(prev => !prev);
      lastClick.current = 0;
    } else {
      // Single click - pronounce
      lastClick.current = now;
      clickTimer.current = setTimeout(() => {
        speak(word.word, 'US');
        clickTimer.current = null;
      }, 250);
    }
  }, [word.word]);

  const stageLabels: Record<number, string> = { 0: '遗忘', 1: '一阶', 2: '二阶', 3: '三阶', 4: '四阶', 5: '五阶', 6: '六阶' };
  const stageColors: Record<number, string> = { 0: 'text-red-500', 1: 'text-blue-400', 2: 'text-blue-500', 3: 'text-blue-600', 4: 'text-purple-500', 5: 'text-purple-600', 6: 'text-green-500' };

  return (
    <div className="bg-bg-secondary rounded-xl shadow-card overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 mr-3 cursor-pointer" onClick={handleClick}>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg font-semibold text-text-primary font-english">{word.word}</span>
              {word.phonetic && (
                <span className="text-xs text-text-secondary">/{word.phonetic}/</span>
              )}
              {word.partOfSpeech && (
                <span className="text-xs text-text-placeholder">{word.partOfSpeech}</span>
              )}
              {stage !== undefined && (
                <span className={`text-xs font-medium ${stageColors[stage] || 'text-text-secondary'}`}>
                  {stageLabels[stage] || `${stage}阶`}
                </span>
              )}
              {errorCount !== undefined && errorCount > 0 && (
                <span className="text-xs text-error">错{errorCount}次</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <button
                onClick={(e) => { e.stopPropagation(); speak(word.word, 'US'); }}
                className="text-xs text-primary-500 hover:text-primary-600 flex items-center gap-0.5"
              >
                🔊 美式
              </button>
              {(showTranslation || isReview) && (
                <span className="text-sm text-primary-600 font-medium">{word.meaning}</span>
              )}
              {!showTranslation && !isReview && (
                <span className="text-xs text-text-placeholder">点击发音 · 双击翻译</span>
              )}
            </div>
            {showTranslation && word.example && (
              <div className="mt-2 p-2 bg-bg-tertiary rounded-lg">
                <p className="text-xs text-text-primary italic">{word.example}</p>
                {word.exampleTrans && (
                  <p className="text-xs text-text-secondary mt-0.5">{word.exampleTrans}</p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {rightContent || (
              showActions && (
                selectMode ? (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); onSelect?.(word.id, 'dontknow'); }}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors text-sm ${
                        selected === 'dontknow' ? 'bg-error text-white' : 'bg-error-bg text-error hover:bg-red-100'
                      }`}
                      title="不认识"
                    >
                      ✗
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onSelect?.(word.id, 'know'); }}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors text-sm ${
                        selected === 'know' ? 'bg-success text-white' : 'bg-success-bg text-success hover:bg-green-100'
                      }`}
                      title="认识"
                    >
                      ✓
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDontKnow?.(word.id); }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-error-bg text-error hover:bg-red-100 transition-colors text-sm"
                      title="不认识"
                    >
                      ✗
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onKnow?.(word.id); }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-success-bg text-success hover:bg-green-100 transition-colors text-sm"
                      title="认识"
                    >
                      ✓
                    </button>
                  </>
                )
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper to extract word object from various API response shapes
export function extractWord(item: any): { id: string; word: string; meaning: string; phonetic?: string; partOfSpeech?: string; example?: string; exampleTrans?: string } {
  if (item.word && typeof item.word === 'object') {
    return item.word;
  }
  return {
    id: item.id || item.wordId,
    word: item.word || item.word?.word || '',
    meaning: item.meaning || item.word?.meaning || '',
    phonetic: item.phonetic || item.word?.phonetic,
    partOfSpeech: item.partOfSpeech || item.word?.partOfSpeech,
    example: item.example || item.word?.example,
    exampleTrans: item.exampleTrans || item.word?.exampleTrans,
  };
}

export default WordListItem;

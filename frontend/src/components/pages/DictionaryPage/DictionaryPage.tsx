import React, { useState } from 'react';
import { PageLayout } from '../../layout/PageLayout';
import { TopNav } from '../../layout/TopNav';
import { Card } from '../../common/Card';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import { dictionaryApi } from '../../../services/api/dictionary';
import { speak } from '../../../services/tts/pronunciation';
import { useUIStore } from '../../../stores/uiStore';

const DICTIONARY_SOURCES = [
  { id: 'CIBA', label: '词霸', icon: '📘' },
  { id: 'BING', label: '必应', icon: '🔍' },
  { id: 'YOUDAO', label: '有道', icon: '📗' },
  { id: 'OULU', label: '欧路', icon: '📙' },
  { id: 'ETY', label: 'Etymonline', icon: '📜' },
  { id: 'CAMBRIDGE', label: '剑桥', icon: '📚' },
  { id: 'MERRIAM', label: '韦氏', icon: '📖' },
  { id: 'OXFORD', label: '牛津', icon: '📕' },
  { id: 'VOCABULARY', label: 'Vocabulary', icon: '📓' },
];

export const DictionaryPage: React.FC = () => {
  const { showToast } = useUIStore();
  const [query, setQuery] = useState('');
  const [source, setSource] = useState('CIBA');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      showToast('请输入要查询的单词', 'warning');
      return;
    }
    setIsLoading(true);
    try {
      const res = await dictionaryApi.search({ q: query.trim(), source });
      setResult(res.data.data!);
    } catch {
      showToast('查询失败，请重试', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <PageLayout>
      <TopNav title="查词典" showBack />

      {/* Search bar */}
      <div className="px-4 py-3">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="输入要查询的英文单词"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Button onClick={handleSearch} isLoading={isLoading}>
            搜索
          </Button>
        </div>
      </div>

      {/* Source tabs */}
      <div className="px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-1.5 pb-2 min-w-max">
          {DICTIONARY_SOURCES.map(s => (
            <button
              key={s.id}
              onClick={() => setSource(s.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                source === s.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-bg-tertiary text-text-secondary hover:bg-primary-50'
              }`}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      <div className="px-4 pb-8">
        {isLoading ? (
          <LoadingSpinner text="查询中..." />
        ) : result ? (
          <div>
            {/* Word header */}
            <Card>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary font-english">{result.word}</h2>
                  {result.examLevel && result.examLevel.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {result.examLevel.map((level: string, i: number) => (
                        <span key={i} className="px-1.5 py-0.5 bg-primary-50 text-primary-600 rounded text-xs">
                          {level}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => speak(result.word, 'US')}
                  className="p-2 bg-primary-50 text-primary-600 rounded-full hover:bg-primary-100"
                >
                  🔊
                </button>
              </div>

              {/* Phonetics */}
              {(result.phonetic || result.phoneticUS || result.phoneticUK) && (
                <div className="flex gap-4 text-sm text-text-secondary mb-4">
                  {result.phoneticUK && <span>英 [{result.phoneticUK}]</span>}
                  {result.phoneticUS && <span>美 [{result.phoneticUS}]</span>}
                  {result.phonetic && !result.phoneticUS && !result.phoneticUK && <span>/{result.phonetic}/</span>}
                </div>
              )}

              {/* Meanings */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-text-secondary">释义</h3>
                {result.meanings?.map((m: any, i: number) => (
                  <div key={i} className="flex gap-2">
                    {m.partOfSpeech && (
                      <span className="text-xs text-primary-500 font-medium px-1.5 py-0.5 bg-primary-50 rounded">
                        {m.partOfSpeech}
                      </span>
                    )}
                    <span className="text-base text-text-primary">{m.definition}</span>
                  </div>
                ))}
              </div>

              {/* Examples */}
              {result.examples && result.examples.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <h3 className="text-sm font-medium text-text-secondary mb-2">例句</h3>
                  {result.examples.map((ex: any, i: number) => (
                    <div key={i} className="mb-2 p-2 bg-bg-tertiary rounded-lg">
                      <p className="text-sm text-text-primary">{ex.sentence}</p>
                      {ex.translation && (
                        <p className="text-xs text-text-secondary mt-1">{ex.translation}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Etymology */}
              {result.etymology && (
                <div className="mt-4 pt-4 border-t border-border">
                  <h3 className="text-sm font-medium text-text-secondary mb-2">📜 词源</h3>
                  <p className="text-sm text-text-primary">{result.etymology}</p>
                </div>
              )}
            </Card>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">📖</p>
            <p className="text-text-secondary text-sm">输入英文单词开始查词典</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

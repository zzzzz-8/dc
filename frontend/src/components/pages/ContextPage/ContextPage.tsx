import React, { useState } from 'react';
import { PageLayout } from '../../layout/PageLayout';
import { TopNav } from '../../layout/TopNav';
import { Card } from '../../common/Card';
import { speak } from '../../../services/tts/pronunciation';

const CONTEXT_SENTENCES = [
  { word: 'set', sentences: ['Please set the table for dinner.', 'She set the book on the shelf.', 'He set a new record in the race.'], meaning: 'v. 放置；设置；设定' },
  { word: 'run', sentences: ['I run every morning to stay fit.', 'The machine runs on electricity.', 'She runs her own business.'], meaning: 'v. 跑步；运行；管理' },
  { word: 'take', sentences: ['Please take a seat.', 'It takes two hours to get there.', 'I take my coffee with sugar.'], meaning: 'v. 拿；花费；吃喝' },
  { word: 'make', sentences: ['She makes her own clothes.', 'Let me make a phone call.', 'They made him the team captain.'], meaning: 'v. 制作；使；成为' },
  { word: 'get', sentences: ['I got a present from my friend.', 'Please get me a glass of water.', 'She gets up at 6 every day.'], meaning: 'v. 得到；拿；变得' },
];

export const ContextPage: React.FC = () => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const word = CONTEXT_SENTENCES.find(w => w.word === selectedWord);

  return (
    <PageLayout showBottomNav={false}>
      <TopNav title="学语境" showBack />

      <div className="px-4 pb-8">
        {!selectedWord ? (
          <>
            <p className="text-sm text-text-secondary mb-3">选择一个单词，查看它在不同语境中的用法</p>
            <div className="space-y-2">
              {CONTEXT_SENTENCES.map(w => (
                <Card key={w.word} className="cursor-pointer active:scale-[0.98]" onClick={() => setSelectedWord(w.word)}>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-primary-500 font-english">{w.word}</span>
                    <span className="text-sm text-text-secondary">{w.meaning}</span>
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : word ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setSelectedWord(null)} className="text-text-secondary">← 返回</button>
              <h2 className="text-xl font-bold text-text-primary font-english">{word.word}</h2>
              <button onClick={() => speak(word.word, 'US')} className="p-1.5 bg-primary-50 text-primary-600 rounded-full">🔊</button>
            </div>
            <p className="text-sm text-text-secondary mb-4">{word.meaning}</p>
            <div className="space-y-3">
              {word.sentences.map((s, i) => (
                <Card key={i}>
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-primary-500 font-medium mt-0.5">例{i + 1}</span>
                    <p className="text-sm text-text-primary">{s}</p>
                    <button onClick={() => speak(s, 'US')} className="ml-auto p-1 text-text-secondary hover:text-primary-500 flex-shrink-0">🔊</button>
                  </div>
                </Card>
              ))}
            </div>
            <button className="w-full mt-4 py-2.5 bg-bg-tertiary text-text-secondary rounded-xl text-sm" onClick={() => setSelectedWord(null)}>
              选择其他单词
            </button>
          </div>
        ) : null}
        <div className="h-8" />
      </div>
    </PageLayout>
  );
};

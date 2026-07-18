import React, { useState } from 'react';
import { PageLayout } from '../../layout/PageLayout';
import { TopNav } from '../../layout/TopNav';
import { Card } from '../../common/Card';
import { speak } from '../../../services/tts/pronunciation';

const NEWS_ARTICLES = [
  { id: 1, title: 'Scientists Discover New Ocean Species', date: '2026-07-08', source: 'BBC News', level: '高中', content: 'A team of marine biologists has discovered over 30 new species in the deep waters of the Pacific Ocean. The expedition, which lasted three months, explored areas of the ocean that had never been studied before. Among the discoveries were a glowing fish, a shrimp with transparent shell, and several types of deep-sea corals. This finding highlights how much we still have to learn about our own planet.', words: 280 },
  { id: 2, title: 'Teen Invents Device to Clean Ocean Plastic', date: '2026-07-07', source: 'CNN', level: '高中', content: 'A 17-year-old student from California has created a new device that can remove plastic waste from the ocean more efficiently than existing methods. The invention, which uses solar power and artificial intelligence, can collect up to 50 kilograms of plastic per day. The teen said he was inspired to create the device after seeing photos of marine animals harmed by plastic pollution. Several environmental organizations have already expressed interest in using the technology.', words: 310 },
  { id: 3, title: 'World Languages Day Celebrated Globally', date: '2026-07-06', source: 'China Daily', level: '初中', content: 'September 26 marks the European Day of Languages, but language lovers around the world celebrate multilingualism all year round. Learning a new language not only allows you to communicate with more people, but also improves your brain function and memory. Studies show that bilingual people are better at multitasking and have a lower risk of developing dementia. Experts recommend starting language learning at a young age, but emphasize that it is never too late to start.', words: 260 },
];

export const NewsReadingPage: React.FC = () => {
  const [selected, setSelected] = useState<typeof NEWS_ARTICLES[0] | null>(null);
  const [selectedWord, setSelectedWord] = useState('');

  if (selected) {
    return (
      <PageLayout showBottomNav={false}>
        <TopNav title={selected.title.substring(0, 12) + '...'} showBack />
        <div className="px-4 pb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-primary-500">{selected.source}</span>
            <span className="text-xs text-text-secondary">{selected.date}</span>
            <span className="px-1.5 py-0.5 bg-primary-50 text-primary-600 rounded text-xs">{selected.level}</span>
          </div>

          <Card>
            <h2 className="text-lg font-bold text-text-primary mb-3">{selected.title}</h2>
            <p className="text-sm text-text-primary leading-relaxed">{selected.content}</p>
          </Card>

          {selectedWord && (
            <Card className="mt-3 bg-primary-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-text-primary">{selectedWord}</p>
                  <p className="text-xs text-text-secondary mt-1">已查询 - 点击发音按钮听读音</p>
                </div>
                <button onClick={() => speak(selectedWord, 'US')} className="p-2 bg-primary-100 text-primary-600 rounded-full">🔊</button>
              </div>
            </Card>
          )}

          <p className="text-xs text-text-secondary mt-3 text-center">点击文章中的单词可查询释义（开发中）</p>
          <button className="w-full mt-4 py-2.5 bg-bg-tertiary text-text-secondary rounded-xl text-sm" onClick={() => setSelected(null)}>
            ← 返回列表
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <TopNav title="学时文" showBack />
      <div className="px-4 pb-4 space-y-3">
        {NEWS_ARTICLES.map(article => (
          <Card key={article.id} className="cursor-pointer active:scale-[0.98]" onClick={() => setSelected(article)}>
            <h3 className="text-base font-semibold text-text-primary mb-1">{article.title}</h3>
            <div className="flex items-center gap-2 mb-2 text-xs">
              <span className="text-primary-500">{article.source}</span>
              <span className="text-text-secondary">{article.date}</span>
              <span className="px-1 py-0.5 bg-primary-50 text-primary-600 rounded">{article.level}</span>
            </div>
            <p className="text-sm text-text-secondary line-clamp-2">{article.content.substring(0, 80)}...</p>
          </Card>
        ))}
        <div className="h-8" />
      </div>
    </PageLayout>
  );
};

import React, { useState } from 'react';
import { PageLayout } from '../../layout/PageLayout';
import { TopNav } from '../../layout/TopNav';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';

const ARTICLES = [
  { id: 1, title: 'The Benefits of Reading', level: '初中', words: 280, content: 'Reading is one of the most important skills that every person should develop. It opens up new worlds and allows us to learn from the experiences of others. When we read, we improve our vocabulary, enhance our concentration, and develop critical thinking skills. Studies have shown that regular reading can reduce stress by up to 68% and improve memory function. Whether you prefer fiction or non-fiction, making reading a daily habit can transform your life in countless ways.' },
  { id: 2, title: 'Healthy Eating Habits', level: '初中', words: 320, content: 'Maintaining a balanced diet is essential for good health. A healthy diet should include a variety of foods from all food groups: fruits and vegetables, whole grains, lean proteins, and healthy fats. It is important to eat regular meals and avoid skipping breakfast. Drinking enough water is also crucial for our bodies to function properly. Remember that small changes in your eating habits can lead to big improvements in your overall health and wellbeing.' },
  { id: 3, title: 'The Importance of Friendship', level: '高中', words: 350, content: 'Friendship plays a vital role in our lives. True friends support us during difficult times and celebrate with us during happy moments. Research indicates that people with strong social connections tend to live longer and experience better mental health. Building and maintaining friendships requires effort, including regular communication, mutual respect, and honesty. In today\'s digital age, while it is easier to connect with others online, nothing can replace the value of face-to-face interactions with close friends.' },
  { id: 4, title: 'Climate Change and Our Future', level: '高中', words: 400, content: 'Climate change is one of the most pressing challenges facing humanity today. Rising global temperatures, melting polar ice caps, and extreme weather events are clear signs that our planet is changing. Scientists agree that human activities, particularly the burning of fossil fuels, are the primary cause of these changes. However, there is still hope. By adopting renewable energy sources, reducing waste, and making sustainable choices, we can work together to create a healthier planet for future generations.' },
];

export const ReadingPage: React.FC = () => {
  const [selected, setSelected] = useState<typeof ARTICLES[0] | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const filtered = selectedLevel === 'all' ? ARTICLES : ARTICLES.filter(a => a.level === selectedLevel);

  if (selected) {
    return (
      <PageLayout showBottomNav={false}>
        <TopNav title={selected.title} showBack />
        <div className="px-4 pb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-0.5 bg-primary-50 text-primary-600 rounded text-xs">{selected.level}</span>
            <span className="text-xs text-text-secondary">{selected.words} 词</span>
            <button className="ml-auto text-xs text-primary-500" onClick={() => setShowTranslation(!showTranslation)}>
              {showTranslation ? '隐藏翻译' : '显示翻译'}
            </button>
          </div>
          <Card>
            <p className="text-sm text-text-primary leading-relaxed whitespace-pre-line">{selected.content}</p>
          </Card>
          <Button variant="secondary" fullWidth className="mt-4" onClick={() => setSelected(null)}>
            ← 返回文章列表
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <TopNav title="目学阅读" showBack />

      <div className="px-4">
        <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
          {['all', '初中', '高中'].map(level => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${selectedLevel === level ? 'bg-primary-500 text-white' : 'bg-bg-tertiary text-text-secondary'}`}
            >{level === 'all' ? '全部' : level}</button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map(article => (
            <Card key={article.id} className="cursor-pointer active:scale-[0.98]" onClick={() => setSelected(article)}>
              <h3 className="text-base font-semibold text-text-primary mb-1">{article.title}</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-1.5 py-0.5 bg-primary-50 text-primary-600 rounded text-xs">{article.level}</span>
                <span className="text-xs text-text-secondary">{article.words} 词</span>
              </div>
              <p className="text-sm text-text-secondary line-clamp-2">{article.content.substring(0, 100)}...</p>
            </Card>
          ))}
        </div>
        <div className="h-8" />
      </div>
    </PageLayout>
  );
};

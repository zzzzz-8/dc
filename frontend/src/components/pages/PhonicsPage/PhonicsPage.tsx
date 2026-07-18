import React, { useState } from 'react';
import { PageLayout } from '../../layout/PageLayout';
import { TopNav } from '../../layout/TopNav';
import { Card } from '../../common/Card';
import { speak } from '../../../services/tts/pronunciation';

const PHONICS_RULES = [
  { pattern: 'a-e', sound: 'eɪ', examples: ['cake', 'make', 'name', 'late', 'game'], desc: 'Magic E：元音字母发字母本身音' },
  { pattern: 'e-e', sound: 'iː', examples: ['these', 'theme', 'scene', 'Pete'], desc: 'Magic E：ee组合发长音' },
  { pattern: 'i-e', sound: 'aɪ', examples: ['kite', 'time', 'nice', 'like', 'five'], desc: 'Magic E：i_e发/aɪ/音' },
  { pattern: 'o-e', sound: 'əʊ', examples: ['home', 'hope', 'note', 'rose', 'stone'], desc: 'Magic E：o_e发/əʊ/音' },
  { pattern: 'u-e', sound: 'juː', examples: ['cube', 'huge', 'mute', 'cute', 'rude'], desc: 'Magic E：u_e发/juː/音' },
  { pattern: 'sh', sound: 'ʃ', examples: ['ship', 'fish', 'shop', 'sheep', 'wish'], desc: 'sh组合发/ʃ/音' },
  { pattern: 'ch', sound: 'tʃ', examples: ['chair', 'chicken', 'lunch', 'much', 'chip'], desc: 'ch组合发/tʃ/音' },
  { pattern: 'th', sound: 'θ/ð', examples: ['think', 'this', 'that', 'three', 'mother'], desc: 'th组合有两种发音' },
  { pattern: 'ph', sound: 'f', examples: ['phone', 'photo', 'elephant', 'graph', 'phrase'], desc: 'ph组合发/f/音' },
  { pattern: 'wh', sound: 'w', examples: ['what', 'when', 'where', 'white', 'why'], desc: 'wh组合发/w/音' },
  { pattern: 'ng', sound: 'ŋ', examples: ['king', 'song', 'long', 'thing', 'morning'], desc: 'ng组合发/ŋ/音' },
  { pattern: 'ck', sound: 'k', examples: ['back', 'duck', 'black', 'truck', 'stick'], desc: 'ck组合发/k/音' },
  { pattern: 'ee', sound: 'iː', examples: ['see', 'tree', 'green', 'sleep', 'three'], desc: 'ee组合发长音/iː/' },
  { pattern: 'ea', sound: 'iː', examples: ['sea', 'read', 'eat', 'bean', 'dream'], desc: 'ea组合发/iː/音' },
  { pattern: 'oo', sound: 'uː/ʊ', examples: ['book', 'school', 'moon', 'good', 'food'], desc: 'oo组合有两种发音' },
  { pattern: 'ai', sound: 'eɪ', examples: ['rain', 'train', 'wait', 'brain', 'paint'], desc: 'ai组合发/eɪ/音' },
  { pattern: 'ay', sound: 'eɪ', examples: ['day', 'play', 'say', 'stay', 'maybe'], desc: 'ay组合发/eɪ/音' },
  { pattern: 'oi/oy', sound: 'ɔɪ', examples: ['boy', 'toy', 'oil', 'voice', 'enjoy'], desc: 'oi/oy组合发/ɔɪ/音' },
];

export const PhonicsPage: React.FC = () => {
  const [selected, setSelected] = useState<typeof PHONICS_RULES[0] | null>(null);

  if (selected) {
    return (
      <PageLayout showBottomNav={false}>
        <TopNav title={`拼读规则: ${selected.pattern}`} showBack />
        <div className="px-4">
          <button onClick={() => setSelected(null)} className="text-sm text-primary-500 mb-3">← 返回规则列表</button>
          <Card>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl font-bold text-primary-500">{selected.pattern}</span>
              <span className="px-2 py-0.5 bg-primary-50 text-primary-600 rounded text-sm">/{selected.sound}/</span>
            </div>
            <p className="text-sm text-text-secondary mb-4">{selected.desc}</p>
            <p className="text-sm font-medium text-text-primary mb-2">示例单词：</p>
            <div className="flex flex-wrap gap-2">
              {selected.examples.map(w => (
                <button key={w} onClick={() => speak(w, 'US')}
                  className="px-3 py-1.5 bg-bg-tertiary rounded-lg text-sm text-text-primary hover:bg-primary-50 hover:text-primary-600"
                >{w} 🔊</button>
              ))}
            </div>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout showBottomNav={false}>
      <TopNav title="学拼读" showBack />
      <div className="px-4 pb-8">
        <p className="text-sm text-text-secondary mb-3">自然拼读规则，掌握字母组合发音规律</p>
        <div className="space-y-2">
          {PHONICS_RULES.map(rule => (
            <Card key={rule.pattern} className="cursor-pointer active:scale-[0.98]" onClick={() => setSelected(rule)}>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-primary-500">{rule.pattern}</span>
                <span className="text-xs text-text-secondary">/{rule.sound}/</span>
                <span className="text-xs text-text-secondary ml-auto">{rule.examples.slice(0, 3).join(', ')}...</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

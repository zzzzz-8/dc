import React, { useState } from 'react';
import { PageLayout } from '../../layout/PageLayout';
import { TopNav } from '../../layout/TopNav';
import { Card } from '../../common/Card';

const ROOTS = [
  { root: 'bio', meaning: '生命', examples: ['biology (生物学)', 'biography (传记)', 'antibiotic (抗生素)'] },
  { root: 'graph/gram', meaning: '写；画', examples: ['geography (地理)', 'photograph (照片)', 'grammar (语法)'] },
  { root: 'tele', meaning: '远', examples: ['telephone (电话)', 'television (电视)', 'telescope (望远镜)'] },
  { root: 'aud', meaning: '听', examples: ['audio (音频)', 'audience (观众)', 'auditorium (礼堂)'] },
  { root: 'dict', meaning: '说', examples: ['dictionary (词典)', 'predict (预测)', 'dictate (听写)'] },
  { root: 'port', meaning: '搬运', examples: ['transport (运输)', 'export (出口)', 'import (进口)'] },
  { root: 'struct', meaning: '建造', examples: ['structure (结构)', 'construct (建造)', 'destroy (摧毁)'] },
  { root: 'vis/vid', meaning: '看', examples: ['vision (视力)', 'visit (参观)', 'video (视频)'] },
  { root: 'cred', meaning: '相信', examples: ['credit (信用)', 'incredible (难以置信的)', 'credential (凭证)'] },
  { root: 'voc/vok', meaning: '声音；叫喊', examples: ['voice (声音)', 'vocabulary (词汇)', 'advocate (提倡)'] },
];

const PREFIXES = [
  { affix: 'un-', meaning: '不；非', examples: ['unhappy (不开心的)', 'unable (不能的)', 'unusual (不寻常的)'] },
  { affix: 're-', meaning: '再；重新', examples: ['rewrite (重写)', 'return (返回)', 'rebuild (重建)'] },
  { affix: 'pre-', meaning: '在…之前', examples: ['preview (预览)', 'prepare (准备)', 'predict (预测)'] },
  { affix: 'dis-', meaning: '不；相反', examples: ['dislike (不喜欢)', 'disagree (不同意)', 'disappear (消失)'] },
  { affix: 'mis-', meaning: '错误', examples: ['mistake (错误)', 'misunderstand (误解)', 'mislead (误导)'] },
];

const SUFFIXES = [
  { affix: '-tion/-sion', meaning: '名词后缀', examples: ['education (教育)', 'decision (决定)', 'information (信息)'] },
  { affix: '-ful', meaning: '充满…的', examples: ['beautiful (美丽的)', 'wonderful (精彩的)', 'helpful (有帮助的)'] },
  { affix: '-less', meaning: '没有…的', examples: ['hopeless (无望的)', 'careless (粗心的)', 'homeless (无家可归的)'] },
  { affix: '-ly', meaning: '副词后缀', examples: ['quickly (快速地)', 'carefully (小心地)', 'happily (快乐地)'] },
  { affix: '-ment', meaning: '名词后缀', examples: ['development (发展)', 'achievement (成就)', 'movement (运动)'] },
];

type Tab = 'root' | 'prefix' | 'suffix';

export const RootAffixPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('root');
  const [selected, setSelected] = useState<string | null>(null);

  const data = tab === 'root' ? ROOTS : tab === 'prefix' ? PREFIXES : SUFFIXES;
  const selectedData = data.find(d => ('root' in d ? (d as any).root : (d as any).affix) === selected);
  const label = tab === 'root' ? '词根' : tab === 'prefix' ? '前缀' : '后缀';

  return (
    <PageLayout showBottomNav={false}>
      <TopNav title="词根词缀" showBack />

      <div className="flex justify-center gap-2 px-4 mb-3">
        {(['root', 'prefix', 'suffix'] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); setSelected(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-primary-500 text-white' : 'bg-bg-tertiary text-text-secondary'}`}
          >{t === 'root' ? '词根' : t === 'prefix' ? '前缀' : '后缀'}</button>
        ))}
      </div>

      <div className="px-4 pb-8">
        {!selected ? (
          <div className="grid grid-cols-2 gap-2">
            {data.map((d: any) => {
              const name = d.root || d.affix;
              return (
                <button key={name} onClick={() => setSelected(name)}
                  className="p-3 bg-bg-secondary rounded-xl shadow-card text-center hover:shadow-md active:scale-95 transition-all"
                >
                  <p className="text-base font-bold text-primary-500 mb-1">{name}</p>
                  <p className="text-xs text-text-secondary">{d.meaning}</p>
                </button>
              );
            })}
          </div>
        ) : (
          <div>
            <button onClick={() => setSelected(null)} className="text-sm text-primary-500 mb-3">← 返回列表</button>
            <Card>
              <p className="text-xl font-bold text-primary-500 mb-1">{selected}</p>
              <p className="text-sm text-text-secondary mb-4">{selectedData?.meaning}</p>
              <p className="text-sm font-medium text-text-primary mb-2">示例单词：</p>
              <ul className="space-y-2">
                {(selectedData as any)?.examples?.map((ex: string, i: number) => (
                  <li key={i} className="p-2 bg-bg-tertiary rounded-lg text-sm text-text-primary">{ex}</li>
                ))}
              </ul>
            </Card>
          </div>
        )}
        <div className="h-8" />
      </div>
    </PageLayout>
  );
};

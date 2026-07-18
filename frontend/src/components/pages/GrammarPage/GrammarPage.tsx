import React from 'react';
import { PageLayout } from '../../layout/PageLayout';
import { TopNav } from '../../layout/TopNav';
import { Card } from '../../common/Card';

const GRAMMAR_TOPICS = [
  { title: '词性', items: ['名词', '动词', '形容词', '副词', '代词', '介词', '连词', '感叹词'] },
  { title: '时态', items: ['一般现在时', '一般过去时', '一般将来时', '现在进行时', '过去进行时', '现在完成时', '过去完成时'] },
  { title: '句式', items: ['陈述句', '疑问句', '祈使句', '感叹句', 'There be 句型'] },
  { title: '从句', items: ['名词性从句', '定语从句', '状语从句', '条件句'] },
];

export const GrammarPage: React.FC = () => {
  return (
    <PageLayout showBottomNav={false}>
      <TopNav title="学语法" showBack />

      <div className="px-4 pb-8">
        <div className="space-y-3">
          {GRAMMAR_TOPICS.map(topic => (
            <Card key={topic.title}>
              <h3 className="text-base font-semibold text-text-primary mb-3">{topic.title}</h3>
              <div className="flex flex-wrap gap-2">
                {topic.items.map(item => (
                  <span
                    key={item}
                    className="px-3 py-1.5 bg-primary-50 text-primary-600 rounded-lg text-sm hover:bg-primary-100 cursor-pointer"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

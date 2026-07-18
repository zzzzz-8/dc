import React, { useState } from 'react';
import { PageLayout } from '../../layout/PageLayout';
import { TopNav } from '../../layout/TopNav';
import { Card } from '../../common/Card';
import { speak } from '../../../services/tts/pronunciation';

const PHONETIC_SYMBOLS = [
  { symbol: 'iː', type: '元音', example: 'see', desc: '长音"衣"' },
  { symbol: 'ɪ', type: '元音', example: 'sit', desc: '短音"衣"' },
  { symbol: 'e', type: '元音', example: 'bed', desc: '"埃"短音' },
  { symbol: 'æ', type: '元音', example: 'cat', desc: '"艾"音' },
  { symbol: 'ɑː', type: '元音', example: 'car', desc: '长音"啊"' },
  { symbol: 'ɒ', type: '元音', example: 'hot', desc: '短音"奥"' },
  { symbol: 'ɔː', type: '元音', example: 'saw', desc: '长音"奥"' },
  { symbol: 'ʊ', type: '元音', example: 'put', desc: '短音"乌"' },
  { symbol: 'uː', type: '元音', example: 'blue', desc: '长音"乌"' },
  { symbol: 'ʌ', type: '元音', example: 'cup', desc: '短音"阿"' },
  { symbol: 'ɜː', type: '元音', example: 'bird', desc: '卷舌音' },
  { symbol: 'ə', type: '元音', example: 'about', desc: '弱读"厄"' },
  { symbol: 'eɪ', type: '元音', example: 'face', desc: '"A"长音' },
  { symbol: 'aɪ', type: '元音', example: 'time', desc: '"I"长音' },
  { symbol: 'ɔɪ', type: '元音', example: 'boy', desc: '"OY"音' },
  { symbol: 'aʊ', type: '元音', example: 'house', desc: '"OW"音' },
  { symbol: 'əʊ', type: '元音', example: 'go', desc: '"O"长音' },
  { symbol: 'ɪə', type: '元音', example: 'ear', desc: '"IA"音' },
  { symbol: 'eə', type: '元音', example: 'hair', desc: '"EA"音' },
  { symbol: 'ʊə', type: '元音', example: 'poor', desc: '"UA"音' },
  { symbol: 'p', type: '辅音', example: 'pen', desc: '爆破音P' },
  { symbol: 'b', type: '辅音', example: 'big', desc: '爆破音B' },
  { symbol: 't', type: '辅音', example: 'ten', desc: '爆破音T' },
  { symbol: 'd', type: '辅音', example: 'dog', desc: '爆破音D' },
  { symbol: 'k', type: '辅音', example: 'cat', desc: '爆破音K' },
  { symbol: 'ɡ', type: '辅音', example: 'go', desc: '爆破音G' },
  { symbol: 'f', type: '辅音', example: 'fish', desc: '摩擦音F' },
  { symbol: 'v', type: '辅音', example: 'voice', desc: '摩擦音V' },
  { symbol: 'θ', type: '辅音', example: 'think', desc: '咬舌清音' },
  { symbol: 'ð', type: '辅音', example: 'this', desc: '咬舌浊音' },
  { symbol: 's', type: '辅音', example: 'sun', desc: '摩擦音S' },
  { symbol: 'z', type: '辅音', example: 'zoo', desc: '摩擦音Z' },
  { symbol: 'ʃ', type: '辅音', example: 'she', desc: '嘘音' },
  { symbol: 'ʒ', type: '辅音', example: 'vision', desc: '浊嘘音' },
  { symbol: 'h', type: '辅音', example: 'hat', desc: '呼气音H' },
  { symbol: 'm', type: '辅音', example: 'man', desc: '鼻音M' },
  { symbol: 'n', type: '辅音', example: 'no', desc: '鼻音N' },
  { symbol: 'ŋ', type: '辅音', example: 'sing', desc: '后鼻音' },
  { symbol: 'l', type: '辅音', example: 'leg', desc: '舌边音L' },
  { symbol: 'r', type: '辅音', example: 'red', desc: '卷舌音R' },
  { symbol: 'j', type: '辅音', example: 'yes', desc: '半元音Y' },
  { symbol: 'w', type: '辅音', example: 'we', desc: '半元音W' },
];

type PhoneticTab = 'vowel' | 'consonant';

export const PhoneticsPage: React.FC = () => {
  const [tab, setTab] = useState<PhoneticTab>('vowel');

  const filtered = tab === 'vowel' ? PHONETIC_SYMBOLS.filter(s => s.type === '元音') : PHONETIC_SYMBOLS.filter(s => s.type === '辅音');

  return (
    <PageLayout showBottomNav={false}>
      <TopNav title="学音标" showBack />

      <div className="flex justify-center gap-2 px-4 mb-3">
        {(['vowel', 'consonant'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-primary-500 text-white' : 'bg-bg-tertiary text-text-secondary'}`}
          >{t === 'vowel' ? '元音 (20)' : '辅音 (22)'}</button>
        ))}
      </div>

      <div className="px-4 pb-8">
        <div className="grid grid-cols-2 gap-2">
          {filtered.map(s => (
            <button key={s.symbol} onClick={() => speak(s.example, 'US')}
              className="p-3 bg-bg-secondary rounded-xl shadow-card text-left hover:shadow-md active:scale-95 transition-all"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg font-bold text-primary-500">/{s.symbol}/</span>
                <span className="text-xs text-text-secondary">{s.example}</span>
              </div>
              <p className="text-xs text-text-secondary">{s.desc}</p>
            </button>
          ))}
        </div>
        <p className="text-xs text-text-secondary text-center mt-4">点击卡片听示例单词发音</p>
        <div className="h-8" />
      </div>
    </PageLayout>
  );
};

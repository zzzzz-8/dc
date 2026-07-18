export type VocabularyLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7' | 'L8' | 'L9' | 'L10';

export class VocabularyService {
  private static readonly SCORE_MAPPING: Record<number, { vocabulary: number; interval: [number, number] }> = {
    0: { vocabulary: 200, interval: [0, 500] },
    1: { vocabulary: 300, interval: [100, 600] },
    2: { vocabulary: 400, interval: [200, 700] },
    3: { vocabulary: 500, interval: [300, 800] },
    4: { vocabulary: 600, interval: [400, 900] },
    5: { vocabulary: 700, interval: [500, 1000] },
    6: { vocabulary: 800, interval: [600, 1100] },
    7: { vocabulary: 900, interval: [700, 1200] },
    8: { vocabulary: 1000, interval: [800, 1300] },
    9: { vocabulary: 1100, interval: [900, 1400] },
    10: { vocabulary: 1200, interval: [1000, 1500] },
    11: { vocabulary: 1300, interval: [1100, 1600] },
    12: { vocabulary: 1400, interval: [1200, 1700] },
    13: { vocabulary: 1500, interval: [1300, 1800] },
    14: { vocabulary: 1600, interval: [1400, 1900] },
    15: { vocabulary: 1700, interval: [1500, 2000] },
    16: { vocabulary: 1800, interval: [1600, 2100] },
    17: { vocabulary: 1900, interval: [1700, 2200] },
    18: { vocabulary: 2000, interval: [1800, 2300] },
    19: { vocabulary: 2100, interval: [1900, 2400] },
    20: { vocabulary: 2200, interval: [2000, 2500] },
    21: { vocabulary: 2300, interval: [2100, 2600] },
    22: { vocabulary: 2400, interval: [2200, 2700] },
    23: { vocabulary: 2500, interval: [2300, 2800] },
    24: { vocabulary: 2600, interval: [2400, 2900] },
    25: { vocabulary: 2700, interval: [2500, 3000] },
    26: { vocabulary: 2800, interval: [2600, 3100] },
    27: { vocabulary: 2900, interval: [2700, 3200] },
    28: { vocabulary: 3000, interval: [2800, 3300] },
    29: { vocabulary: 3100, interval: [2900, 3400] },
    30: { vocabulary: 3200, interval: [3000, 3500] },
    31: { vocabulary: 3400, interval: [3200, 3800] },
    32: { vocabulary: 3600, interval: [3400, 4000] },
    33: { vocabulary: 3800, interval: [3600, 4200] },
    34: { vocabulary: 4000, interval: [3800, 4400] },
    35: { vocabulary: 4200, interval: [4000, 4600] },
    36: { vocabulary: 4500, interval: [4300, 4900] },
    37: { vocabulary: 4800, interval: [4600, 5200] },
    38: { vocabulary: 5100, interval: [4900, 5500] },
    39: { vocabulary: 5500, interval: [5300, 5900] },
    40: { vocabulary: 6000, interval: [5800, 6400] },
    41: { vocabulary: 6500, interval: [6300, 6900] },
    42: { vocabulary: 7000, interval: [6800, 7400] },
    43: { vocabulary: 7500, interval: [7300, 7900] },
    44: { vocabulary: 8000, interval: [7800, 8400] },
    45: { vocabulary: 8500, interval: [8300, 8900] },
    46: { vocabulary: 9000, interval: [8800, 9400] },
    47: { vocabulary: 9500, interval: [9300, 9900] },
    48: { vocabulary: 10000, interval: [9800, 10400] },
    49: { vocabulary: 10500, interval: [10300, 10900] },
    50: { vocabulary: 11000, interval: [10800, 11400] },
    51: { vocabulary: 11500, interval: [11300, 11900] },
    52: { vocabulary: 12000, interval: [11800, 12400] },
    53: { vocabulary: 12500, interval: [12300, 12900] },
    54: { vocabulary: 13000, interval: [12800, 13400] },
    55: { vocabulary: 13500, interval: [13300, 13900] },
    56: { vocabulary: 14000, interval: [13800, 14400] },
    57: { vocabulary: 14500, interval: [14300, 14900] },
    58: { vocabulary: 15000, interval: [14800, 15400] },
    59: { vocabulary: 16000, interval: [15800, 16400] },
    60: { vocabulary: 18000, interval: [17800, 18200] },
  };

  static estimateVocabulary(score: number) {
    const clampedScore = Math.max(0, Math.min(60, score));
    const mapping = this.SCORE_MAPPING[clampedScore] || this.SCORE_MAPPING[0];

    const levelMap: Record<string, { level: VocabularyLevel; label: string }> = {
      '0-200': { level: 'L1' as VocabularyLevel, label: '初级入门' },
      '201-500': { level: 'L2' as VocabularyLevel, label: '小学基础' },
      '501-1000': { level: 'L3' as VocabularyLevel, label: '小学高级' },
      '1001-1500': { level: 'L4' as VocabularyLevel, label: '初中基础' },
      '1501-2000': { level: 'L5' as VocabularyLevel, label: '初中高级' },
      '2001-2500': { level: 'L6' as VocabularyLevel, label: '高中基础' },
      '2501-3500': { level: 'L7' as VocabularyLevel, label: '高中高级' },
      '3501-4500': { level: 'L8' as VocabularyLevel, label: '大学四级' },
      '4501-6000': { level: 'L9' as VocabularyLevel, label: '大学六级' },
      '6001-20000': { level: 'L10' as VocabularyLevel, label: '雅思级别' },
    };

    let level: VocabularyLevel = 'L1';
    let levelLabel = '初级入门';
    for (const [range, info] of Object.entries(levelMap)) {
      const [min, max] = range.split('-').map(Number);
      if (mapping.vocabulary >= min && mapping.vocabulary <= max) {
        level = info.level;
        levelLabel = info.label;
        break;
      }
    }

    const suggestions = this.generateSuggestions(level, mapping.vocabulary);

    return {
      vocabulary: mapping.vocabulary,
      level,
      levelLabel,
      interval: mapping.interval,
      suggestions,
    };
  }

  private static generateSuggestions(level: VocabularyLevel, vocabulary: number): string[] {
    const suggestionsMap: Record<VocabularyLevel, string[]> = {
      L1: [
        '建议从基础词汇开始，每天学习5-10个新词',
        '使用图片联想记忆法，建立单词与实物的联系',
        '多听简单的英文儿歌和故事培养语感',
      ],
      L2: [
        '重点掌握日常生活词汇（颜色、数字、动物、家庭）',
        '每天学习10-15个新词，配合例句记忆',
        '使用"单词环"功能进行主题分类学习',
      ],
      L3: [
        '扩展词汇量至小学高年级水平（约1000词）',
        '开始学习简单的短语和固定搭配',
        '使用"语境短文"功能在真实语境中学习',
      ],
      L4: [
        '重点突破3000-4000词段，把错词放回阅读语境中复习',
        '增加限时阅读训练，记录影响理解速度的高频词',
        '整理派生词、词性变化和固定搭配，提升迁移能力',
      ],
      L5: [
        '开始接触中考真题阅读，积累考试高频词',
        '使用"完形填空"和"多选五"题型训练',
        '用错题记录追踪"认识但选错"的词，优先解决释义混淆',
      ],
      L6: [
        '重点突破3000-6000词段，把错词放回阅读语境中复习',
        '增加限时阅读训练，记录影响理解速度的高频词',
        '整理派生词、词性变化和固定搭配，提升迁移能力',
      ],
      L7: [
        '开始阅读外刊原文（如时文阅读模块）',
        '重点记忆学术词汇和书面表达词汇',
        '使用"词根词缀"功能系统学习构词法',
      ],
      L8: [
        '建议使用"查词典"功能深入学习单词的用法和搭配',
        '使用"学语法"模块巩固复杂句式结构',
        '通过"听写"和"拼写"功能强化输出能力',
      ],
      L9: [
        '通过"学听力"模块提升听力理解能力',
        '使用"作业单"模块进行综合阅读训练',
        '坚持每日复习，保持词汇量稳定增长',
      ],
      L10: [
        '挑战高阶阅读材料（如学术论文、文学原著）',
        '使用"查词典"深入理解单词的细微差别',
        '持续扩大词汇量至15000+，达到母语者水平',
      ],
    };

    return suggestionsMap[level] || ['继续保持学习节奏，定期复测检验进步。'];
  }
}

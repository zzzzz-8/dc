import React, { useEffect, useState } from 'react';
import { PageLayout } from '../../layout/PageLayout';
import { TopNav } from '../../layout/TopNav';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { EmptyState } from '../../common/EmptyState';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import { BottomSheet } from '../../common/BottomSheet';
import { errorBookApi } from '../../../services/api/errorBook';
import { useUIStore } from '../../../stores/uiStore';
import type { UserWord } from '../../../types/models';

export const ErrorBookPage: React.FC = () => {
  const { showToast } = useUIStore();
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'ERROR' | 'COLLECTED'>('ALL');
  const [noteSheet, setNoteSheet] = useState<{ open: boolean; wordId: string; note: string }>({
    open: false,
    wordId: '',
    note: '',
  });

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await errorBookApi.list({ filter, page: 1, limit: 50 });
      const data = res.data.data!;
      setItems(data.items);
      setTotal(data.total);
      setErrorCount(data.errorCount);
    } catch {
      showToast('加载失败', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (wordId: string) => {
    try {
      await errorBookApi.remove(wordId);
      showToast('已移除', 'success');
      loadData();
    } catch {
      showToast('操作失败', 'error');
    }
  };

  const handleSaveNote = async () => {
    try {
      await errorBookApi.addNote(noteSheet.wordId, { note: noteSheet.note });
      showToast('笔记已保存', 'success');
      setNoteSheet({ open: false, wordId: '', note: '' });
      loadData();
    } catch {
      showToast('保存失败', 'error');
    }
  };

  const handleExport = async () => {
    try {
      const res = await errorBookApi.exportToWordbook();
      showToast(`已导出${res.data.data?.wordCount || 0}个单词到词书`, 'success');
    } catch {
      showToast('导出失败', 'error');
    }
  };

  return (
    <PageLayout>
      <TopNav
        title={`错词本 (${errorCount})`}
        showBack
        rightAction={
          <button onClick={handleExport} className="text-xs text-primary-500 font-medium">
            合成词书
          </button>
        }
      />

      {/* Filter tabs */}
      <div className="flex gap-2 px-4 py-2">
        {(['ALL', 'ERROR', 'COLLECTED'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f
                ? 'bg-primary-500 text-white'
                : 'bg-bg-tertiary text-text-secondary'
            }`}
          >
            {f === 'ALL' ? '全部' : f === 'ERROR' ? '错词' : '收藏'}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="px-4 pb-4">
        {isLoading ? (
          <LoadingSpinner text="加载中..." />
        ) : items.length === 0 ? (
          <EmptyState
            icon="🎉"
            title="暂无错词"
            description="继续学习，错词会自动记录在这里"
            actionText="去学习"
            onAction={() => window.history.back()}
          />
        ) : (
          <div className="space-y-2">
            {items.map((item: any) => (
              <Card key={item.id} padding="sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-semibold text-text-primary">{item.word?.word}</span>
                      {item.phonetic && (
                        <span className="text-xs text-text-secondary">/{item.phonetic}/</span>
                      )}
                    </div>
                    <p className="text-sm text-primary-600 mt-0.5">{item.meaning}</p>
                    {item.note && (
                      <p className="text-xs text-text-secondary mt-1 bg-bg-tertiary p-1.5 rounded">
                        📝 {item.note}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-error">错误 {item.errorCount}次</span>
                      {item.isCollected && <span className="text-xs text-warning">⭐ 已收藏</span>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setNoteSheet({ open: true, wordId: item.wordId, note: item.note || '' })}
                      className="p-1.5 text-text-secondary hover:text-primary-500"
                    >
                      📝
                    </button>
                    <button
                      onClick={() => handleRemove(item.wordId)}
                      className="p-1.5 text-text-secondary hover:text-error"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Note BottomSheet */}
      <BottomSheet
        isOpen={noteSheet.open}
        onClose={() => setNoteSheet({ open: false, wordId: '', note: '' })}
        title="编辑笔记"
      >
        <textarea
          className="w-full h-24 p-3 border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={noteSheet.note}
          onChange={e => setNoteSheet(prev => ({ ...prev, note: e.target.value }))}
          placeholder="输入笔记内容..."
        />
        <div className="flex gap-3 mt-3">
          <Button variant="secondary" fullWidth onClick={() => setNoteSheet({ open: false, wordId: '', note: '' })}>
            取消
          </Button>
          <Button fullWidth onClick={handleSaveNote}>
            保存
          </Button>
        </div>
      </BottomSheet>
    </PageLayout>
  );
};

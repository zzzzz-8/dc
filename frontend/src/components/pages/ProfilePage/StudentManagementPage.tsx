import React, { useEffect, useState } from 'react';
import { PageLayout } from '../../layout/PageLayout';
import { TopNav } from '../../layout/TopNav';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { Modal } from '../../common/Modal';
import { EmptyState } from '../../common/EmptyState';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import { userApi } from '../../../services/api/user';
import { useUIStore } from '../../../stores/uiStore';

export const StudentManagementPage: React.FC = () => {
  const { showToast } = useUIStore();
  const [students, setStudents] = useState<any[]>([]);
  const [canAddMore, setCanAddMore] = useState(true);
  const [maxStudents, setMaxStudents] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', phone: '', password: '123456' });

  useEffect(() => { loadStudents(); }, []);

  const loadStudents = async () => {
    try {
      const res = await userApi.getStudents();
      const data = res.data.data!;
      setStudents(data.students);
      setCanAddMore(data.canAddMore);
      setMaxStudents(data.maxStudents);
    } catch {} finally { setIsLoading(false); }
  };

  const handleAdd = async () => {
    if (!newStudent.name.trim()) { showToast('请输入学生姓名', 'warning'); return; }
    try {
      await userApi.createStudent(newStudent);
      showToast('添加成功', 'success');
      setShowAddModal(false);
      setNewStudent({ name: '', phone: '', password: '123456' });
      loadStudents();
    } catch { showToast('添加失败', 'error'); }
  };

  const handleDelete = async (id: string) => {
    try {
      await userApi.deleteStudent(id);
      showToast('已删除', 'success');
      loadStudents();
    } catch { showToast('删除失败', 'error'); }
  };

  return (
    <PageLayout showBottomNav={false}>
      <TopNav title="学生管理" showBack rightAction={
        canAddMore ? <button onClick={() => setShowAddModal(true)} className="text-sm text-primary-500 font-medium">+ 添加</button> : null
      } />

      <div className="px-4 pb-8">
        {isLoading ? <LoadingSpinner /> : students.length === 0 ? (
          <EmptyState icon="👦" title="暂无学生" description="添加学生账号，方便管理学习进度" actionText="添加学生" onAction={() => setShowAddModal(true)} />
        ) : (
          <div className="space-y-2">
            {students.map((s: any) => (
              <Card key={s.id} padding="sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{s.name}</p>
                    <p className="text-xs text-text-secondary">账号：{s.account}</p>
                    {s.phone && <p className="text-xs text-text-secondary">手机：{s.phone}</p>}
                    <p className="text-xs text-text-secondary">剩余课时：{s.remainingHours}h</p>
                  </div>
                  <button onClick={() => handleDelete(s.id)} className="text-xs text-error">删除</button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!canAddMore && (
          <Card className="mt-3 bg-warning-bg text-warning text-sm text-center">
            {maxStudents ? `个人版最多添加 ${maxStudents} 个学生` : '已达到上限'}
          </Card>
        )}
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="添加学生">
        <div className="space-y-3">
          <input placeholder="学生姓名" value={newStudent.name} onChange={e => setNewStudent(s => ({ ...s, name: e.target.value }))}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          <input placeholder="手机号（选填）" value={newStudent.phone} onChange={e => setNewStudent(s => ({ ...s, phone: e.target.value }))}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          <input placeholder="密码（默认123456）" value={newStudent.password} onChange={e => setNewStudent(s => ({ ...s, password: e.target.value }))}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          <Button fullWidth onClick={handleAdd}>确认添加</Button>
        </div>
      </Modal>
    </PageLayout>
  );
};

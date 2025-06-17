"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { RecordItem } from "@/components/features/record/RecordItem";
import { AddRecordDialog } from "@/components/features/record/AddRecordDialog";
import { useRecords } from "@/lib/hooks/useRecords";
import { useSchedule } from "@/lib/hooks/useSchedule";
import { useFamilyMembers } from "@/lib/hooks/useMembers";
import { ClipboardList } from "lucide-react";
import { AddRecordData } from "@/lib/hooks/useRecords";

export default function RecordPage() {
  const { activeMember } = useFamilyMembers();
  const { records, addRecord, loading } = useRecords(activeMember?.id || null);
  const { schedules } = useSchedule(activeMember?.id || null);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // 过滤出待接种计划作为选项
  const vaccineOptions = schedules.filter(schedule => schedule.status === 'upcoming');

  // 处理添加记录
  const handleAddRecord = async (data: any) => {
    if (activeMember?.id) {
      await addRecord({
        ...data,
        // 将日期对象转换为字符串
        date: typeof data.date === 'object' && data.date !== null
          ? data.date.toISOString().split('T')[0]
          : data.date
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <PageHeader title="电子记录本" />
      
      <div className="flex-1 overflow-auto">
        <div className="mx-auto px-4 sm:px-6 md:px-8 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl py-4">
          {loading ? (
            <div className="flex items-center justify-center h-full py-12">
              <p className="text-slate-500">加载中...</p>
            </div>
          ) : records.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="暂无接种记录"
              description={activeMember ? `${activeMember.name}还没有疫苗接种记录` : '请先选择家庭成员'}
              action={
                activeMember && (
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    添加接种记录
                  </Button>
                )
              }
            />
          ) : (
            <div className="space-y-4">
              <h2 className="text-sm font-medium text-slate-500">
                {activeMember?.name || '未知'} 的接种记录
              </h2>
              <div>
                {records.map((record) => (
                  <RecordItem key={record.id} record={record} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 添加接种记录悬浮按钮 */}
      {activeMember && records.length > 0 && (
        <Button
          className="fixed bottom-20 right-4 sm:right-6 rounded-full h-12 w-12 shadow-lg p-0"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-5 w-5" />
          <span className="sr-only">添加接种记录</span>
        </Button>
      )}
      
      {/* 添加接种记录对话框 */}
      <AddRecordDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddRecord={handleAddRecord}
        vaccineOptions={vaccineOptions}
      />
    </div>
  );
} 
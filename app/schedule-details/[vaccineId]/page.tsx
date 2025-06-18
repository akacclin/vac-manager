'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CalendarClock, Check, ChevronRight, MapPin, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/PageHeader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useSchedule } from '@/lib/hooks/useSchedule';
import { useRecords } from '@/lib/hooks/useRecords';
import { useFamilyMembers } from '@/lib/hooks/useMembers';
import { formatDate } from '@/lib/utils';

export const runtime = 'edge';

export default function ScheduleDetailPage() {
  const params = useParams<{ vaccineId: string }>();
  const router = useRouter();
  const { activeMember } = useFamilyMembers();
  const { schedules, loading: loadingSchedule } = useSchedule(activeMember?.id || null);
  const { addRecord } = useRecords(activeMember?.id || null);
  
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [location, setLocation] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // 从URL参数获取疫苗ID
  const vaccineId = params.vaccineId;
  
  // 查找对应的疫苗接种计划
  const vaccineSchedule = schedules.find(s => s.id === vaccineId);
  
  // 处理标记为已完成
  const handleMarkComplete = async () => {
    if (!activeMember?.id || !vaccineSchedule) return;
    
    setSubmitting(true);
    
    try {
      await addRecord({
        vaccineId: vaccineSchedule.vaccineId,
        vaccineName: vaccineSchedule.vaccineName,
        date: new Date().toISOString().split('T')[0],
        location: location,
        dose: vaccineSchedule.dose,
        lotNumber: lotNumber,
      });
      
      setShowCompleteDialog(false);
      // 返回到记录页
      router.push('/record');
    } catch (error) {
      console.error('标记失败:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  // 查找接种点
  const handleFindLocation = () => {
    router.push('/locations');
  };
  
  if (loadingSchedule) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <PageHeader title="接种详情" showBackButton />
        <div className="flex-1 p-4 flex items-center justify-center">
          <p className="text-slate-500">加载中...</p>
        </div>
      </div>
    );
  }
  
  if (!vaccineSchedule) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <PageHeader title="接种详情" showBackButton />
        <div className="flex-1 overflow-auto">
          <div className="mx-auto px-4 sm:px-6 md:px-8 py-4 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
            <Card className="p-6 text-center shadow-sm">
              <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h2 className="text-lg font-medium mb-2">未找到接种计划</h2>
              <p className="text-slate-500 mb-6">无法找到对应的接种计划详情</p>
              <Button onClick={() => router.back()}>返回</Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }
  
  const daysLeft = Math.max(0, Math.ceil((new Date(vaccineSchedule.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
  const isOverdue = new Date(vaccineSchedule.dueDate) < new Date() && vaccineSchedule.status === 'upcoming';
  
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <PageHeader title="接种提醒详情" showBackButton />
      
      <div className="flex-1 overflow-auto">
        <div className="mx-auto px-4 sm:px-6 md:px-8 py-4 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl space-y-4">
          {/* 疫苗基本信息 */}
          <Card className="p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-medium">{vaccineSchedule.vaccineName}</h2>
                <p className="text-sm text-slate-500 mt-1">第 {vaccineSchedule.dose} 剂</p>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-sm ${
                vaccineSchedule.status === 'completed' 
                  ? 'bg-green-50 text-green-500' 
                  : isOverdue
                    ? 'bg-red-50 text-red-500'
                    : 'bg-sky-50 text-sky-500'
              }`}>
                {vaccineSchedule.status === 'completed' 
                  ? '已完成' 
                  : isOverdue 
                    ? '已逾期'
                    : '待接种'
                }
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-sky-500">
              <CalendarClock className="h-4 w-4" />
              <span className="text-sm">建议接种日期: {formatDate(vaccineSchedule.dueDate)}</span>
            </div>
            
            {vaccineSchedule.status === 'upcoming' && (
              <div className="mt-4 border-t border-slate-100 pt-4 flex justify-between items-center">
                <div className="text-sm">
                  <span className="text-slate-500">距离接种日还有</span>
                </div>
                <div className="text-2xl font-bold text-sky-500">
                  {daysLeft} <span className="text-sm font-normal">天</span>
                </div>
              </div>
            )}
          </Card>
          
          {/* 疫苗介绍 */}
          <Card className="p-5 shadow-sm">
            <h3 className="text-base font-medium mb-3">疫苗介绍</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              该疫苗用于预防相关疾病，建议按照推荐的接种方案及时接种。
            </p>
            <Link 
              href={`/knowledge/${vaccineSchedule.vaccineId}`}
              className="mt-3 text-sm text-sky-500 flex items-center"
            >
              查看详细介绍 <ChevronRight className="h-3 w-3 ml-1" />
            </Link>
          </Card>
          
          {/* 接种前准备 */}
          <Card className="p-5 shadow-sm">
            <h3 className="text-base font-medium mb-3">接种前准备</h3>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>体温正常，无发热、急性疾病或慢性疾病急性发作</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>携带预防接种证和户口簿/身份证</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>穿着宽松、易于露出接种部位的衣服</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>填写《预防接种知情同意书》</span>
              </li>
            </ul>
          </Card>
          
          {/* 接种后注意事项 */}
          <Card className="p-5 shadow-sm">
            <h3 className="text-base font-medium mb-3">接种后注意事项</h3>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2 text-sm">
                <ShieldCheck className="h-4 w-4 text-sky-500 mt-0.5 flex-shrink-0" />
                <span>接种后留观30分钟，确认无异常反应后方可离开</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <ShieldCheck className="h-4 w-4 text-sky-500 mt-0.5 flex-shrink-0" />
                <span>接种部位保持清洁干燥，当天避免洗澡</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <ShieldCheck className="h-4 w-4 text-sky-500 mt-0.5 flex-shrink-0" />
                <span>接种后24-48小时内可能出现发热、局部红肿等反应，一般无需特殊处理</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <ShieldCheck className="h-4 w-4 text-sky-500 mt-0.5 flex-shrink-0" />
                <span>如出现持续高热或其他异常反应，及时就医</span>
              </li>
            </ul>
          </Card>
          
          {/* 操作按钮 */}
          {vaccineSchedule.status === 'upcoming' && (
            <div className="grid grid-cols-2 gap-3 mt-6">
              <Button 
                variant="outline"
                onClick={handleFindLocation}
                className="flex items-center justify-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                查找接种点
              </Button>
              <Button 
                onClick={() => setShowCompleteDialog(true)}
                className="flex items-center justify-center gap-2"
              >
                <Check className="h-4 w-4" />
                标记为已完成
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* 标记为已完成对话框 */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>标记接种完成</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="location" className="text-right text-sm">
                接种地点
              </label>
              <Input
                id="location"
                placeholder="请输入接种地点"
                className="col-span-3"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="lotNumber" className="text-right text-sm">
                批次号
              </label>
              <Input
                id="lotNumber"
                placeholder="疫苗批次号（选填）"
                className="col-span-3"
                value={lotNumber}
                onChange={(e) => setLotNumber(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
              取消
            </Button>
            <Button onClick={handleMarkComplete} disabled={!location || submitting}>
              {submitting ? '提交中...' : '确认'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
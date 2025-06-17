'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { VaccineRecord } from '@/store/useAppStore';

// 定义表单数据Schema
const formSchema = z.object({
  vaccineId: z.string().min(1, '请选择疫苗'),
  vaccineName: z.string().min(1, '请填写疫苗名称'),
  date: z.date({ required_error: '请选择接种日期' }),
  location: z.string().min(1, '请填写接种地点'),
  dose: z.number().int().positive('剂次必须为正整数'),
  lotNumber: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AddRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddRecord: (data: FormData) => Promise<void>;
  vaccineOptions: VaccineRecord[];
}

export function AddRecordDialog({ open, onOpenChange, onAddRecord, vaccineOptions }: AddRecordDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dose: 1,
      date: new Date(),
    }
  });
  
  const selectedDate = watch('date');

  // 处理表单提交
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      await onAddRecord(data);
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error('提交记录失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理疫苗选择
  const handleVaccineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const vaccineId = e.target.value;
    setValue('vaccineId', vaccineId);
    
    const selectedVaccine = vaccineOptions.find(option => option.vaccineId === vaccineId);
    if (selectedVaccine) {
      setValue('vaccineName', selectedVaccine.vaccineName);
      setValue('dose', selectedVaccine.dose);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>添加接种记录</DialogTitle>
          <DialogDescription>记录宝宝的疫苗接种信息</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {/* 疫苗选择 */}
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="vaccine" className="text-right text-sm">
                疫苗选择
              </label>
              <div className="col-span-3">
                <select
                  id="vaccine"
                  className="w-full p-2 rounded-md border border-slate-200"
                  onChange={handleVaccineChange}
                >
                  <option value="">选择疫苗...</option>
                  {vaccineOptions.map((vaccine) => (
                    <option key={vaccine.id} value={vaccine.vaccineId}>
                      {vaccine.vaccineName} (第 {vaccine.dose} 剂)
                    </option>
                  ))}
                </select>
                {errors.vaccineId && (
                  <p className="text-sm text-red-500 mt-1">{errors.vaccineId.message}</p>
                )}
              </div>
            </div>
            
            {/* 接种日期 */}
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">接种日期</label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-slate-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'yyyy年MM月dd日', { locale: zhCN }) : "选择日期"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => setValue('date', date || new Date())}
                      initialFocus
                      locale={zhCN}
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>
                )}
              </div>
            </div>
            
            {/* 接种地点 */}
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="location" className="text-right text-sm">
                接种地点
              </label>
              <div className="col-span-3">
                <Input
                  id="location"
                  className="col-span-3"
                  {...register('location')}
                  placeholder="例如：xx社区卫生服务中心"
                />
                {errors.location && (
                  <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>
                )}
              </div>
            </div>
            
            {/* 批次号 */}
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="lotNumber" className="text-right text-sm">
                批次号
              </label>
              <div className="col-span-3">
                <Input
                  id="lotNumber"
                  className="col-span-3"
                  {...register('lotNumber')}
                  placeholder="选填"
                />
              </div>
            </div>
            
            {/* 备注 */}
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="notes" className="text-right text-sm">
                备注
              </label>
              <div className="col-span-3">
                <textarea
                  id="notes"
                  className="w-full p-2 rounded-md border border-slate-200 min-h-[80px]"
                  {...register('notes')}
                  placeholder="选填，记录不良反应等信息"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '提交中...' : '保存'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 
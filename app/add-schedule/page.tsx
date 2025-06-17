'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFamilyMembers } from '@/lib/hooks/useMembers';

// 表单验证Schema
const formSchema = z.object({
  name: z.string().min(1, '请填写宝宝姓名'),
  birthDate: z.date({
    required_error: '请选择出生日期',
  }),
  selectedVaccines: z.array(z.string()).min(1, '请至少选择一种疫苗'),
});

type FormData = z.infer<typeof formSchema>;

interface VaccineOption {
  id: string;
  name: string;
  category: '国家免疫规划' | '推荐接种';
}

// 示例疫苗数据
const vaccineOptions: VaccineOption[] = [
  { id: 'hepb', name: '乙肝疫苗', category: '国家免疫规划' },
  { id: 'bcg', name: 'BCG疫苗', category: '国家免疫规划' },
  { id: 'opv', name: '脊灰疫苗', category: '国家免疫规划' },
  { id: 'dtp', name: '百白破疫苗', category: '国家免疫规划' },
  { id: 'mmr', name: '麻腮风疫苗', category: '国家免疫规划' },
  { id: 'var', name: '水痘疫苗', category: '推荐接种' },
  { id: 'hib', name: 'b型流感嗜血杆菌疫苗', category: '推荐接种' },
  { id: 'rv', name: '轮状病毒疫苗', category: '推荐接种' },
  { id: 'pcv', name: '肺炎球菌结合疫苗', category: '推荐接种' },
  { id: 'hepa', name: '甲肝疫苗', category: '推荐接种' },
  { id: 'hpv', name: 'HPV疫苗', category: '推荐接种' },
  { id: 'flu', name: '流感疫苗', category: '推荐接种' },
];

export default function AddSchedulePage() {
  const [currentStep, setCurrentStep] = useState<'info' | 'vaccines'>('info');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { addMember } = useFamilyMembers();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedVaccines: ['hepb', 'bcg', 'opv', 'dtp'], // 默认选择国家免疫规划的一部分
    },
  });
  
  const birthDate = watch('birthDate');
  const selectedVaccines = watch('selectedVaccines');
  
  // 处理出生日期选择
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setValue('birthDate', date);
    }
  };
  
  // 处理疫苗选择
  const handleVaccineToggle = (vaccineId: string) => {
    const currentSelected = selectedVaccines || [];
    if (currentSelected.includes(vaccineId)) {
      setValue(
        'selectedVaccines',
        currentSelected.filter((id) => id !== vaccineId)
      );
    } else {
      setValue('selectedVaccines', [...currentSelected, vaccineId]);
    }
  };
  
  // 表单提交
  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    
    try {
      // 1. 添加新成员
      const newMember = await addMember({
        name: data.name,
        birthDate: data.birthDate.toISOString().split('T')[0],
      });
      
      if (!newMember) {
        throw new Error('添加成员失败');
      }
      
      // 2. 创建接种计划
      const response = await fetch(`/api/members/${newMember.id}/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedVaccines: data.selectedVaccines,
        }),
      });
      
      if (!response.ok) {
        throw new Error('创建接种计划失败');
      }
      
      // 3. 成功添加后返回个人页面
      router.push('/profile');
    } catch (error) {
      console.error('创建计划失败:', error);
      // 可以添加错误提示
    } finally {
      setSubmitting(false);
    }
  };
  
  // 返回按钮处理
  const handleBack = () => {
    if (currentStep === 'vaccines') {
      setCurrentStep('info');
    } else {
      router.back();
    }
  };
  
  // 下一步按钮处理
  const handleNext = () => {
    if (currentStep === 'info') {
      if (watch('name') && watch('birthDate')) {
        setCurrentStep('vaccines');
      }
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <PageHeader 
        title={currentStep === 'info' ? '添加家庭成员' : '选择疫苗'} 
        showBackButton 
      />
      
      <div className="flex-1 overflow-auto">
        <div className="mx-auto px-4 sm:px-6 md:px-8 py-4 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
          {/* 步骤指示器 */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                currentStep === 'info' ? 'bg-sky-500 text-white' : 'bg-green-500 text-white'
              }`}>
                1
              </div>
              <div className="h-1 w-12 bg-slate-200">
                <div className={`h-1 ${currentStep === 'info' ? 'w-0' : 'w-full'} bg-green-500 transition-all`}></div>
              </div>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                currentStep === 'vaccines' ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                2
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* 步骤1: 基本信息 */}
            {currentStep === 'info' && (
              <Card className="p-6 shadow-sm">
                <h2 className="text-lg font-medium mb-4">宝宝基本信息</h2>
                
                <div className="space-y-4">
                  {/* 姓名输入 */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium">
                      宝宝姓名/昵称
                    </label>
                    <Input
                      id="name"
                      placeholder="请输入宝宝姓名或昵称"
                      {...register('name')}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">{errors.name.message}</p>
                    )}
                  </div>
                  
                  {/* 出生日期选择 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">出生日期</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !birthDate && "text-slate-500"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {birthDate ? format(birthDate, 'yyyy年MM月dd日', { locale: zhCN }) : "选择出生日期"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={birthDate}
                          onSelect={handleDateSelect}
                          disabled={(date) =>
                            date > new Date() || date < new Date('2000-01-01')
                          }
                          initialFocus
                          locale={zhCN}
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.birthDate && (
                      <p className="text-red-500 text-sm">{errors.birthDate.message}</p>
                    )}
                  </div>
                  
                  <Button 
                    type="button"
                    onClick={handleNext}
                    className="w-full mt-4"
                    disabled={!watch('name') || !watch('birthDate')}
                  >
                    下一步
                  </Button>
                </div>
              </Card>
            )}
            
            {/* 步骤2: 选择疫苗 */}
            {currentStep === 'vaccines' && (
              <div className="space-y-4">
                <Card className="p-6 shadow-sm">
                  <h2 className="text-lg font-medium mb-4">请选择接种疫苗</h2>
                  
                  <Tabs defaultValue="recommended" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="recommended">国家免疫规划</TabsTrigger>
                      <TabsTrigger value="optional">推荐接种</TabsTrigger>
                    </TabsList>
                    
                    {/* 国家免疫规划疫苗选项 */}
                    <TabsContent value="recommended" className="space-y-2">
                      {vaccineOptions
                        .filter((v) => v.category === '国家免疫规划')
                        .map((vaccine) => (
                          <div
                            key={vaccine.id}
                            className="flex items-center space-x-2 border p-3 rounded-md"
                          >
                            <Checkbox
                              id={vaccine.id}
                              checked={selectedVaccines?.includes(vaccine.id)}
                              onCheckedChange={() => handleVaccineToggle(vaccine.id)}
                            />
                            <label
                              htmlFor={vaccine.id}
                              className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {vaccine.name}
                            </label>
                          </div>
                        ))}
                    </TabsContent>
                    
                    {/* 推荐接种疫苗选项 */}
                    <TabsContent value="optional" className="space-y-2">
                      {vaccineOptions
                        .filter((v) => v.category === '推荐接种')
                        .map((vaccine) => (
                          <div
                            key={vaccine.id}
                            className="flex items-center space-x-2 border p-3 rounded-md"
                          >
                            <Checkbox
                              id={vaccine.id}
                              checked={selectedVaccines?.includes(vaccine.id)}
                              onCheckedChange={() => handleVaccineToggle(vaccine.id)}
                            />
                            <label
                              htmlFor={vaccine.id}
                              className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {vaccine.name}
                            </label>
                          </div>
                        ))}
                    </TabsContent>
                  </Tabs>
                  
                  {errors.selectedVaccines && (
                    <p className="text-red-500 text-sm mt-2">{errors.selectedVaccines.message}</p>
                  )}
                </Card>
                
                <div className="flex space-x-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setCurrentStep('info')}
                  >
                    上一步
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={submitting}
                  >
                    {submitting ? '创建中...' : '创建计划'}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
} 
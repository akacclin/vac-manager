"use client";

import Link from 'next/link';
import { Book, MapPin, Bell, Calendar, Syringe, Activity, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useFamilyMembers } from '@/lib/hooks/useMembers';
import { useSchedule } from '@/lib/hooks/useSchedule';
import { useState } from 'react';

interface VaccineNews {
  id: string;
  title: string;
  date: string;
}

// 模拟疫苗健康资讯数据
const vaccineNews: VaccineNews[] = [
  {
    id: 'news1',
    title: '儿童疫苗接种最新指南发布，全国接种率提升',
    date: '2024-10-15'
  },
  {
    id: 'news2',
    title: '流感季来临，专家建议及时接种流感疫苗',
    date: '2024-10-10'
  },
  {
    id: 'news3',
    title: '新研究：婴幼儿按时接种疫苗可提高免疫力',
    date: '2024-10-05'
  }
];

export default function HomePage() {
  const { activeMember } = useFamilyMembers();
  const { nextVaccine, schedules, daysLeft, formattedDate } = useSchedule(activeMember?.id || null);
  const [expandNews, setExpandNews] = useState(false);
  
  // 计算接种进度
  const completedCount = schedules.filter(s => s.status === 'completed').length;
  const totalCount = schedules.length || 1;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="mx-auto px-4 py-6 sm:max-w-xl md:max-w-2xl lg:max-w-4xl">
      {/* 顶部信息栏 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">健康宝宝</h1>
          <p className="text-slate-500">
            {activeMember?.name || '宝宝'}，接种进度 {completedCount}/{totalCount}
          </p>
        </div>
        <Link href="/messages" className="p-2 relative">
          <Bell className="h-6 w-6 text-slate-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Link>
      </div>

      {/* 进度条 */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-slate-500 mb-2">
          <span>疫苗接种进度</span>
          <span>{progressPercentage}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* 下一针接种卡片 */}
      <Card className="mb-6 bg-gradient-to-br from-sky-500 to-sky-400 text-white shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5" />
            <h2 className="text-lg font-semibold">下一针接种</h2>
          </div>
          
          {nextVaccine ? (
            <>
              <h3 className="text-xl font-bold mb-2">{nextVaccine.vaccineName}</h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm opacity-90">{formattedDate}</p>
                  <p className="text-sm">第 {nextVaccine.dose} 针</p>
                </div>
                <div className="text-center">
                  <p className="text-xs opacity-90">剩余天数</p>
                  <p className="text-3xl font-bold">{daysLeft}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link href={`/schedule-details/${nextVaccine.id}`}>
                  <Button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                    查看详情
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="py-4 text-center">
              <p className="mb-2">暂无待接种疫苗</p>
              <Link href="/add-schedule">
                <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                  制定接种计划
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 功能入口 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Link href="/record">
          <Card className="h-full hover:shadow-md transition-all">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
              <Syringe className="h-6 w-6 text-sky-500 mb-2" />
              <h3 className="text-sm font-semibold">接种记录</h3>
            </CardContent>
          </Card>
        </Link>
        <Link href="/locations">
          <Card className="h-full hover:shadow-md transition-all">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
              <MapPin className="h-6 w-6 text-sky-500 mb-2" />
              <h3 className="text-sm font-semibold">查找接种点</h3>
            </CardContent>
          </Card>
        </Link>
        <Link href="/knowledge">
          <Card className="h-full hover:shadow-md transition-all">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
              <Book className="h-6 w-6 text-sky-500 mb-2" />
              <h3 className="text-sm font-semibold">疫苗知识库</h3>
            </CardContent>
          </Card>
        </Link>
        <Link href="/add-schedule">
          <Card className="h-full hover:shadow-md transition-all">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
              <Calendar className="h-6 w-6 text-sky-500 mb-2" />
              <h3 className="text-sm font-semibold">接种计划</h3>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* 接种统计 */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-sky-500" />
            <h3 className="text-base font-semibold">接种统计</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">{completedCount}</p>
              <p className="text-xs text-slate-500">已完成</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-sky-500">
                {schedules.filter(s => s.status === 'upcoming').length}
              </p>
              <p className="text-xs text-slate-500">待接种</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">
                {schedules.filter(s => 
                  s.status === 'upcoming' && new Date(s.dueDate) < new Date()
                ).length}
              </p>
              <p className="text-xs text-slate-500">已逾期</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 健康资讯 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-sky-500" />
              <h3 className="text-base font-semibold">疫苗健康资讯</h3>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setExpandNews(!expandNews)}
              className="text-xs"
            >
              {expandNews ? '收起' : '查看更多'}
            </Button>
          </div>
          
          <div className="space-y-3">
            {vaccineNews.slice(0, expandNews ? undefined : 2).map(news => (
              <div key={news.id} className="border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-medium line-clamp-2">{news.title}</h4>
                  <Badge variant="outline" className="ml-2 whitespace-nowrap text-xs">
                    {news.date}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
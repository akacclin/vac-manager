"use client";

import { useState, useEffect, useMemo } from 'react';
import { useAppStore, VaccineRecord } from '@/store/useAppStore';
import { formatDistanceToNow, parseISO, format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface UseScheduleOptions {
  sortByDate?: boolean;
}

export interface UseScheduleReturn {
  schedules: VaccineRecord[];
  nextVaccine: VaccineRecord | null;
  formattedDate: string;
  daysLeft: number;
  loading: boolean;
  error: string | null;
  fetchSchedules: () => Promise<void>;
}

export const useSchedule = (
  memberId: string | null,
  options: UseScheduleOptions = {}
): UseScheduleReturn => {
  const { sortByDate = true } = options;
  
  const {
    schedules,
    setSchedules,
    isLoading,
    error,
    setLoading,
    setError
  } = useAppStore();
  
  const [initialized, setInitialized] = useState(false);
  
  // 获取指定成员的接种计划
  const memberSchedules = useMemo(() => {
    if (!memberId) return [];
    
    const result = schedules[memberId] || [];
    
    if (sortByDate) {
      return [...result].sort((a, b) => {
        if (a.status === 'upcoming' && b.status !== 'upcoming') return -1;
        if (a.status !== 'upcoming' && b.status === 'upcoming') return 1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    }
    
    return result;
  }, [memberId, schedules, sortByDate]);
  
  // 下一个待接种疫苗
  const nextVaccine = useMemo(() => {
    return memberSchedules.find(vaccine => vaccine.status === 'upcoming') || null;
  }, [memberSchedules]);
  
  // 格式化日期和计算倒计时
  const formattedDate = nextVaccine 
    ? format(parseISO(nextVaccine.dueDate), 'yyyy年MM月dd日', { locale: zhCN }) 
    : '';
  
  const daysLeft = nextVaccine 
    ? Math.max(0, Math.ceil((new Date(nextVaccine.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;
  
  // 获取接种计划
  const fetchSchedules = async (): Promise<void> => {
    if (!memberId || isLoading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/members/${memberId}/schedule`);
      
      if (!response.ok) {
        throw new Error(`获取接种计划失败: ${response.status}`);
      }
      
      const data = await response.json();
      setSchedules(memberId, data.schedules);
    } catch (err) {
      console.error('获取接种计划失败:', err);
      setError(err instanceof Error ? err.message : '获取接种计划失败');
    } finally {
      setLoading(false);
    }
  };
  
  // 初始加载数据
  useEffect(() => {
    if (memberId && !initialized) {
      fetchSchedules();
      setInitialized(true);
    }
  }, [memberId, initialized]);
  
  return {
    schedules: memberSchedules,
    nextVaccine,
    formattedDate,
    daysLeft,
    loading: isLoading,
    error,
    fetchSchedules
  };
}; 
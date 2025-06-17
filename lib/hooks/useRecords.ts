import { useState, useEffect } from 'react';
import { useAppStore, CompletedRecord } from '@/store/useAppStore';

export interface AddRecordData {
  vaccineId: string;
  vaccineName: string;
  date: string;
  location: string;
  dose: number;
  lotNumber?: string;
  notes?: string;
}

export interface UseRecordsReturn {
  records: CompletedRecord[];
  loading: boolean;
  error: string | null;
  fetchRecords: () => Promise<void>;
  addRecord: (record: AddRecordData) => Promise<CompletedRecord | null>;
}

export const useRecords = (memberId: string | null): UseRecordsReturn => {
  const {
    records,
    setRecords,
    isLoading,
    error,
    setLoading,
    setError
  } = useAppStore();
  
  const [initialized, setInitialized] = useState(false);
  
  // 获取指定成员的接种记录
  const memberRecords = memberId ? (records[memberId] || []) : [];
  
  // 获取接种记录
  const fetchRecords = async (): Promise<void> => {
    if (!memberId || isLoading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/members/${memberId}/records`);
      
      if (!response.ok) {
        throw new Error(`获取接种记录失败: ${response.status}`);
      }
      
      const data = await response.json();
      setRecords(memberId, data.records);
    } catch (err) {
      console.error('获取接种记录失败:', err);
      setError(err instanceof Error ? err.message : '获取接种记录失败');
    } finally {
      setLoading(false);
    }
  };
  
  // 添加接种记录
  const addRecord = async (record: AddRecordData): Promise<CompletedRecord | null> => {
    if (!memberId) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/members/${memberId}/records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(record)
      });
      
      if (!response.ok) {
        throw new Error(`添加记录失败: ${response.status}`);
      }
      
      const newRecord = await response.json();
      
      // 更新本地缓存
      const currentRecords = records[memberId] || [];
      setRecords(memberId, [...currentRecords, newRecord]);
      
      return newRecord;
    } catch (err) {
      console.error('添加记录失败:', err);
      setError(err instanceof Error ? err.message : '添加记录失败');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // 初始加载数据
  useEffect(() => {
    if (memberId && !initialized) {
      fetchRecords();
      setInitialized(true);
    }
  }, [memberId, initialized]);
  
  return {
    records: memberRecords,
    loading: isLoading,
    error,
    fetchRecords,
    addRecord
  };
}; 
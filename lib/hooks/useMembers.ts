"use client";

import { useState, useEffect } from 'react';
import { useAppStore, FamilyMember } from '@/store/useAppStore';

export interface UseFamilyMembersReturn {
  members: FamilyMember[];
  activeMember: FamilyMember | null;
  setActiveMember: (memberId: string | null) => void;
  loading: boolean;
  error: string | null;
  fetchMembers: () => Promise<void>;
  addMember: (member: Omit<FamilyMember, 'id'>) => Promise<FamilyMember | null>;
}

export const useFamilyMembers = (): UseFamilyMembersReturn => {
  const {
    familyMembers,
    activeMemberId,
    setFamilyMembers,
    setActiveMember,
    isLoading,
    error,
    setLoading,
    setError
  } = useAppStore();
  
  const [initialized, setInitialized] = useState(false);

  // 获取活跃成员
  const activeMember = familyMembers.find(member => member.id === activeMemberId) || null;
  
  // 获取所有家庭成员
  const fetchMembers = async (): Promise<void> => {
    if (isLoading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/members');
      
      if (!response.ok) {
        throw new Error(`获取家庭成员失败: ${response.status}`);
      }
      
      const data = await response.json();
      setFamilyMembers(data.members);
      
      // 如果没有活跃成员但有成员列表，设置第一个为活跃成员
      if (!activeMemberId && data.members.length > 0) {
        setActiveMember(data.members[0].id);
      }
    } catch (err) {
      console.error('获取家庭成员失败:', err);
      setError(err instanceof Error ? err.message : '获取家庭成员失败');
    } finally {
      setLoading(false);
    }
  };
  
  // 添加新成员
  const addMember = async (member: Omit<FamilyMember, 'id'>): Promise<FamilyMember | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(member)
      });
      
      if (!response.ok) {
        throw new Error(`添加成员失败: ${response.status}`);
      }
      
      const newMember = await response.json();
      
      // 更新本地缓存
      setFamilyMembers([...familyMembers, newMember]);
      
      // 如果这是第一个成员，设为活跃成员
      if (familyMembers.length === 0) {
        setActiveMember(newMember.id);
      }
      
      return newMember;
    } catch (err) {
      console.error('添加成员失败:', err);
      setError(err instanceof Error ? err.message : '添加成员失败');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // 初始加载数据
  useEffect(() => {
    if (!initialized) {
      fetchMembers();
      setInitialized(true);
    }
  }, [initialized]);
  
  return {
    members: familyMembers,
    activeMember,
    setActiveMember,
    loading: isLoading,
    error,
    fetchMembers,
    addMember
  };
}; 
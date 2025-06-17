import { create } from 'zustand';

// 类型定义
export interface FamilyMember {
  id: string;
  name: string;
  birthDate: string;
  avatar?: string;
}

export interface VaccineRecord {
  id: string;
  vaccineId: string;
  vaccineName: string;
  dueDate: string;
  status: 'completed' | 'upcoming' | 'overdue';
  dose: number;
}

export interface CompletedRecord {
  id: string;
  vaccineId: string;
  vaccineName: string;
  date: string;
  location: string;
  lotNumber?: string;
  notes?: string;
  dose: number;
}

interface AppState {
  // UI状态
  activeMemberId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // 数据缓存
  familyMembers: FamilyMember[];
  schedules: Record<string, VaccineRecord[]>; // 按memberId索引
  records: Record<string, CompletedRecord[]>; // 按memberId索引
  
  // Actions
  setActiveMember: (memberId: string | null) => void;
  setLoading: (status: boolean) => void;
  setError: (error: string | null) => void;
  
  // 数据操作
  setFamilyMembers: (members: FamilyMember[]) => void;
  setSchedules: (memberId: string, schedules: VaccineRecord[]) => void;
  setRecords: (memberId: string, records: CompletedRecord[]) => void;
  
  // 重置状态
  reset: () => void;
}

// 初始状态
const initialState = {
  activeMemberId: null,
  isLoading: false,
  error: null,
  familyMembers: [],
  schedules: {},
  records: {},
};

// 创建store
export const useAppStore = create<AppState>((set) => ({
  ...initialState,
  
  // UI状态设置
  setActiveMember: (memberId) => set({ activeMemberId: memberId }),
  setLoading: (status) => set({ isLoading: status }),
  setError: (error) => set({ error }),
  
  // 数据操作
  setFamilyMembers: (members) => set({ familyMembers: members }),
  setSchedules: (memberId, schedules) => set((state) => ({
    schedules: {
      ...state.schedules,
      [memberId]: schedules
    }
  })),
  setRecords: (memberId, records) => set((state) => ({
    records: {
      ...state.records,
      [memberId]: records
    }
  })),
  
  // 重置
  reset: () => set(initialState)
})); 
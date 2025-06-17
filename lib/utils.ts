import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { v4 as uuidv4 } from 'uuid';

/**
 * 合并Tailwind CSS类名的工具函数
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 格式化日期为中文友好格式
 */
export function formatDate(date: string | Date, formatStr: string = 'yyyy年MM月dd日'): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: zhCN });
  } catch (error) {
    console.error('日期格式化失败:', error);
    return String(date);
  }
}

/**
 * 计算年龄，返回"X岁X个月"格式
 */
export function calculateAge(birthDate: string | Date): string {
  try {
    const birthDateObj = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
    const today = new Date();
    
    let years = today.getFullYear() - birthDateObj.getFullYear();
    let months = today.getMonth() - birthDateObj.getMonth();
    
    // 调整月份差异
    if (months < 0 || (months === 0 && today.getDate() < birthDateObj.getDate())) {
      years--;
      months += 12;
    }
    
    // 婴幼儿特殊处理
    if (years === 0) {
      if (months === 0) {
        const days = Math.floor((today.getTime() - birthDateObj.getTime()) / (1000 * 60 * 60 * 24));
        return `${days}天`;
      }
      return `${months}个月`;
    }
    
    // 标准格式
    return months > 0 ? `${years}岁${months}个月` : `${years}岁`;
  } catch (error) {
    console.error('年龄计算失败:', error);
    return '';
  }
}

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return uuidv4();
}

/**
 * 安全获取嵌套对象属性
 */
export function getNestedValue<T>(obj: any, path: string, defaultValue: T): T {
  try {
    return path.split('.').reduce((prev, curr) => {
      return prev && prev[curr] !== undefined ? prev[curr] : undefined;
    }, obj) || defaultValue;
  } catch (error) {
    return defaultValue;
  }
} 
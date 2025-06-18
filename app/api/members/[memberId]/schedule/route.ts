import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { generateId } from '@/lib/utils';

export const runtime = 'edge';

// 读取数据库文件
async function readDb() {
  const filePath = path.join(process.cwd(), 'data/mock-db.json');
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

// 写入数据库文件
async function writeDb(data: any) {
  const filePath = path.join(process.cwd(), 'data/mock-db.json');
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// 定义接种计划类型
interface VaccineSchedule {
  id: string;
  vaccineId: string;
  vaccineName: string;
  dueDate: string;
  status: string;
  dose: number;
}

// GET: 获取成员的接种计划
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  const { memberId } = await params;
  
  if (!memberId) {
    return NextResponse.json(
      { error: '缺少成员ID' },
      { status: 400 }
    );
  }
  
  try {
    const db = await readDb();
    
    if (!db.members.find((m: any) => m.id === memberId)) {
      return NextResponse.json(
        { error: '成员不存在' },
        { status: 404 }
      );
    }
    
    const schedules = db.schedules[memberId] || [];
    
    return NextResponse.json({ schedules }, { status: 200 });
  } catch (error) {
    console.error('获取接种计划失败:', error);
    return NextResponse.json(
      { error: '获取接种计划失败', detail: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST: 生成或更新接种计划
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  const { memberId } = await params;
  
  if (!memberId) {
    return NextResponse.json(
      { error: '缺少成员ID' },
      { status: 400 }
    );
  }
  
  try {
    const db = await readDb();
    
    const member = db.members.find((m: any) => m.id === memberId);
    if (!member) {
      return NextResponse.json(
        { error: '成员不存在' },
        { status: 404 }
      );
    }
    
    const requestData = await request.json();
    const { selectedVaccines = [] } = requestData;
    
    // 获取疫苗数据库
    const vaccineFilePath = path.join(process.cwd(), 'data/vaccines.json');
    const vaccineData = JSON.parse(await fs.readFile(vaccineFilePath, 'utf8'));
    
    // 计算出生日期
    const birthDate = new Date(member.birthDate);
    
    // 简单示例：不同疫苗在不同月龄接种，用于计算接种日期
    const monthsByVaccineType: Record<string, number[]> = {
      'hepb': [0, 1, 6], // 出生、1月龄、6月龄
      'bcg': [0],        // 出生后
      'opv': [2, 3, 4],  // 2月龄、3月龄、4月龄
      'dtp': [3, 4, 5],  // 3月龄、4月龄、5月龄
      'mmr': [8],        // 8月龄
      'var': [12],       // 12月龄
      'hib': [2, 4, 6],  // 2月龄、4月龄、6月龄
      'rv': [2, 4, 6],   // 2月龄、4月龄、6月龄
      'pcv': [2, 4, 6],  // 2月龄、4月龄、6月龄
      'hepa': [18],      // 18月龄
      'hpv': [108],      // 9岁（108月龄）
      'flu': [6]         // 6月龄以上每年一次
    };
    
    // 创建接种计划
    const schedules: VaccineSchedule[] = selectedVaccines.flatMap((vaccineId: string) => {
      const vaccine = vaccineData.vaccines.find((v: any) => v.id === vaccineId);
      if (!vaccine) return [];
      
      const months = monthsByVaccineType[vaccineId] || [2]; // 默认2月龄
      
      // 为每个月龄创建一个接种计划
      return months.map((monthAge, index) => {
        const dueDate = new Date(birthDate);
        dueDate.setMonth(dueDate.getMonth() + monthAge);
        
        return {
          id: generateId(),
          vaccineId: vaccineId,
          vaccineName: vaccine.name,
          dueDate: dueDate.toISOString().split('T')[0],
          status: 'upcoming',
          dose: index + 1
        };
      });
    });
    
    // 如果有现有计划，合并它们
    const existingSchedules = db.schedules[memberId] || [];
    const mergedSchedules = [...existingSchedules];
    
    // 添加新的计划，避免重复
    schedules.forEach((schedule: VaccineSchedule) => {
      if (!mergedSchedules.find(s => s.vaccineId === schedule.vaccineId && s.dose === schedule.dose)) {
        mergedSchedules.push(schedule);
      }
    });
    
    // 更新数据库
    db.schedules[memberId] = mergedSchedules;
    await writeDb(db);
    
    return NextResponse.json({ schedules: mergedSchedules }, { status: 200 });
  } catch (error) {
    console.error('更新接种计划失败:', error);
    return NextResponse.json(
      { error: '更新接种计划失败', detail: (error as Error).message },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { generateId } from '@/lib/utils';

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

// GET: 获取成员的接种记录
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
    
    const records = db.records[memberId] || [];
    
    return NextResponse.json({ records }, { status: 200 });
  } catch (error) {
    console.error('获取接种记录失败:', error);
    return NextResponse.json(
      { error: '获取接种记录失败', detail: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST: 添加接种记录
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
    
    const recordData = await request.json();
    
    // 验证必要字段
    if (!recordData.vaccineId || !recordData.date || !recordData.location) {
      return NextResponse.json(
        { error: '缺少必要字段' },
        { status: 400 }
      );
    }
    
    // 创建新记录
    const newRecord = {
      id: generateId(),
      vaccineId: recordData.vaccineId,
      vaccineName: recordData.vaccineName,
      date: recordData.date,
      location: recordData.location,
      dose: recordData.dose || 1,
      lotNumber: recordData.lotNumber || '',
      notes: recordData.notes || ''
    };
    
    // 添加到数据库
    if (!db.records[memberId]) {
      db.records[memberId] = [];
    }
    
    db.records[memberId].push(newRecord);
    
    // 更新对应的接种计划状态
    if (db.schedules[memberId]) {
      const scheduleIndex = db.schedules[memberId].findIndex(
        (s: any) => s.vaccineId === recordData.vaccineId && s.dose === recordData.dose
      );
      
      if (scheduleIndex !== -1) {
        db.schedules[memberId][scheduleIndex].status = 'completed';
      }
    }
    
    // 写回数据库
    await writeDb(db);
    
    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error('添加接种记录失败:', error);
    return NextResponse.json(
      { error: '添加接种记录失败', detail: (error as Error).message },
      { status: 500 }
    );
  }
} 
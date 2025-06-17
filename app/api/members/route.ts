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

// GET: 获取所有家庭成员
export async function GET(req: NextRequest) {
  try {
    const db = await readDb();
    return NextResponse.json({ members: db.members }, { status: 200 });
  } catch (error) {
    console.error('获取家庭成员失败:', error);
    return NextResponse.json(
      { error: '获取家庭成员失败', detail: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST: 添加新家庭成员
export async function POST(req: NextRequest) {
  try {
    const memberData = await req.json();
    
    // 验证必要字段
    if (!memberData.name || !memberData.birthDate) {
      return NextResponse.json(
        { error: '缺少必要字段' },
        { status: 400 }
      );
    }
    
    // 读取数据库
    const db = await readDb();
    
    // 创建新成员
    const newMember = {
      id: generateId(),
      name: memberData.name,
      birthDate: memberData.birthDate,
      avatar: memberData.avatar || `/avatars/child${db.members.length % 5 + 1}.png`
    };
    
    // 添加到数据库
    db.members.push(newMember);
    
    // 初始化该成员的接种计划和记录
    if (!db.schedules[newMember.id]) {
      db.schedules[newMember.id] = [];
    }
    
    if (!db.records[newMember.id]) {
      db.records[newMember.id] = [];
    }
    
    // 写回数据库
    await writeDb(db);
    
    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error('添加家庭成员失败:', error);
    return NextResponse.json(
      { error: '添加家庭成员失败', detail: (error as Error).message },
      { status: 500 }
    );
  }
} 
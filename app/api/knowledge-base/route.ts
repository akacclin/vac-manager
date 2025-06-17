import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    // 读取本地数据文件
    const filePath = path.join(process.cwd(), 'data/vaccines.json');
    const data = await fs.readFile(filePath, 'utf8');
    const vaccines = JSON.parse(data);
    
    // 返回数据，确保返回格式正确
    return NextResponse.json(vaccines, { status: 200 });
  } catch (error) {
    console.error('获取疫苗知识库数据失败', error);
    return NextResponse.json(
      { error: '获取数据失败', detail: (error as Error).message },
      { status: 500 }
    );
  }
} 
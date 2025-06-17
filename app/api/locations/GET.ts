import { NextRequest, NextResponse } from 'next/server';
import { VaccineLocation } from '@/lib/amap';

// 模拟数据，实际项目中应该从高德地图 API 获取
const mockLocations: VaccineLocation[] = [
  {
    id: '1',
    name: '社区卫生服务中心(徐汇区)',
    address: '上海市徐汇区医学院路123号',
    distance: 800,
    tel: '021-12345678',
    location: {
      lat: 31.1982,
      lng: 121.4375
    }
  },
  {
    id: '2',
    name: '儿童保健院(浦东新区)',
    address: '上海市浦东新区张杨路3040号',
    distance: 1200,
    tel: '021-87654321',
    location: {
      lat: 31.2288,
      lng: 121.5427
    }
  },
  {
    id: '3',
    name: '妇幼保健院(静安区)',
    address: '上海市静安区江宁路166号',
    distance: 2100,
    tel: '021-55555555',
    location: {
      lat: 31.2341,
      lng: 121.4542
    }
  },
  {
    id: '4',
    name: '综合医院疫苗接种点',
    address: '上海市黄浦区瑞金二路197号',
    distance: 3200,
    tel: '021-66666666',
    location: {
      lat: 31.2148,
      lng: 121.4779
    }
  },
  {
    id: '5',
    name: '预防保健中心接种点',
    address: '上海市长宁区长宁路999号',
    distance: 4100,
    tel: '021-77777777',
    location: {
      lat: 31.2197,
      lng: 121.4242
    }
  }
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const latitude = searchParams.get('latitude');
  const longitude = searchParams.get('longitude');
  const keyword = searchParams.get('keyword') || '';
  
  // 在实际项目中，这里应调用高德地图 API 使用提供的坐标搜索附近的接种点
  // 但由于这是一个模拟后端，我们使用模拟数据

  // 如果有关键词，尝试过滤结果
  let filteredLocations = mockLocations;
  if (keyword) {
    filteredLocations = mockLocations.filter(location => 
      location.name.toLowerCase().includes(keyword.toLowerCase()) || 
      location.address.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // 模拟基于距离排序
  filteredLocations.sort((a, b) => a.distance - b.distance);

  // 加入 1-2 秒延时，模拟网络请求
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 1000));

  return NextResponse.json({
    status: 'success',
    data: filteredLocations
  });
} 
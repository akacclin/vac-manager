import { notFound } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/shared/PageHeader';

// 获取疫苗详情数据
async function getVaccineDetail(slug: string) {
  try {
    const filePath = path.join(process.cwd(), 'data/vaccines.json');
    const data = await fs.readFile(filePath, 'utf8');
    const vaccines = JSON.parse(data).vaccines;
    
    return vaccines.find((vaccine: any) => vaccine.slug === slug);
  } catch (error) {
    console.error('获取疫苗详情失败', error);
    return null;
  }
}

interface VaccineDetailParams {
  params: Promise<{
    vaccineSlug: string;
  }>;
}

export default async function VaccineDetailPage({ params }: VaccineDetailParams) {
  const { vaccineSlug } = await params;
  const vaccine = await getVaccineDetail(vaccineSlug);
  
  if (!vaccine) {
    notFound();
  }
  
  return (
    <div className="container mx-auto max-w-md pb-20">
      <PageHeader
        title={vaccine.name}
        showBackButton
      />
      
      <div className="px-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-1 rounded-full text-xs bg-sky-100 text-sky-700">
            {vaccine.category}
          </span>
          <p className="text-slate-600 text-sm">{vaccine.shortDescription}</p>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-2 text-slate-800">接种时间</h2>
              <p className="text-slate-600">{vaccine.schedule}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-3 text-slate-800">疫苗介绍</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">{vaccine.content.introduction}</p>
              
              <h3 className="text-base font-medium mb-2 text-slate-700">接种对象</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">{vaccine.content.target}</p>
              
              <h3 className="text-base font-medium mb-2 text-slate-700">保护效果</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">{vaccine.content.effect}</p>
              
              <h3 className="text-base font-medium mb-2 text-slate-700">不良反应</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">{vaccine.content.sideEffects}</p>
              
              <h3 className="text-base font-medium mb-2 text-slate-700">接种禁忌</h3>
              <p className="text-slate-600 leading-relaxed">{vaccine.content.contraindications}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-3 text-slate-800">接种准备</h2>
              <ul className="list-disc list-inside space-y-2 text-slate-600">
                <li>带好儿童预防接种证和身份证明</li>
                <li>接种前应保持儿童休息充足，身体状况良好</li>
                <li>告知医生儿童近期健康状况和过敏史</li>
                <li>接种后需在接种点留观30分钟</li>
                <li>接种后24-48小时内避免剧烈活动和洗澡</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
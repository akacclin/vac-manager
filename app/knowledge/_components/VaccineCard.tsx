'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Vaccine {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  schedule: string;
}

interface VaccineCardProps {
  vaccine: Vaccine;
}

export function VaccineCard({ vaccine }: VaccineCardProps) {
  // 根据疫苗分类选择徽章颜色
  const badgeVariant = vaccine.category === '一类疫苗' ? 'default' : 'secondary';

  return (
    <Card className="h-full transition-all duration-200 hover:shadow-md hover:-translate-y-1">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-slate-800">{vaccine.name}</CardTitle>
          <Badge variant={badgeVariant} className="ml-2">
            {vaccine.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600 mb-3">{vaccine.shortDescription}</p>
        <div className="text-xs text-slate-500">
          <span className="font-medium">接种时间：</span>
          <span>{vaccine.schedule}</span>
        </div>
      </CardContent>
    </Card>
  );
} 
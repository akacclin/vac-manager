import { formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { CompletedRecord } from '@/store/useAppStore';

interface RecordItemProps {
  record: CompletedRecord;
}

export function RecordItem({ record }: RecordItemProps) {
  return (
    <Card className="p-4 mb-3 flex items-start gap-4 shadow-sm">
      <div className="bg-green-50 rounded-full p-2">
        <CheckCircle className="h-5 w-5 text-green-500" />
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium text-base">{record.vaccineName}</h4>
            <p className="text-sm text-slate-500 mt-1">{record.location}</p>
          </div>
          
          <Badge variant="outline" className="bg-slate-50 text-slate-700">
            第 {record.dose} 剂
          </Badge>
        </div>
        
        <div className="mt-4 text-sm flex justify-between items-center">
          <span className="text-slate-500">接种日期</span>
          <span className="font-medium">{formatDate(record.date)}</span>
        </div>
        
        {record.lotNumber && (
          <div className="mt-1 text-sm flex justify-between items-center">
            <span className="text-slate-500">批次号</span>
            <span>{record.lotNumber}</span>
          </div>
        )}
        
        {record.notes && (
          <div className="mt-3 border-t border-slate-100 pt-3">
            <p className="text-sm text-slate-600">{record.notes}</p>
          </div>
        )}
      </div>
    </Card>
  );
} 
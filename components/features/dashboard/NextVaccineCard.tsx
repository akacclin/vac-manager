"use client";

import { Calendar, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

interface NextVaccineCardProps {
  id: string;
  name: string;
  date: string;
  daysLeft: number;
}

export function NextVaccineCard({ id, name, date, daysLeft }: NextVaccineCardProps) {
  const router = useRouter();
  
  const handleClick = () => {
    router.push(`/schedule-details/${id}`);
  };
  
  return (
    <div 
      onClick={handleClick}
      className="bg-gradient-to-br from-sky-400/90 to-sky-500/90 text-white p-6 rounded-3xl shadow-md mb-6 cursor-pointer transition-all duration-300 hover:shadow-lg backdrop-blur-sm relative overflow-hidden"
    >
      {/* 装饰性背景元素 */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10 blur-xl"></div>
      
      <h2 className="text-xl font-bold mb-4 tracking-tight relative">{name}</h2>
      
      <div className="flex items-center gap-2 mb-3 opacity-90 relative">
        <div className="p-1.5 bg-white/20 rounded-full">
          <Calendar size={16} />
        </div>
        <span className="text-sm">{date}</span>
      </div>
      
      <div className="flex items-center gap-3 mt-5 relative">
        <div className="p-1.5 bg-white/20 rounded-full">
          <Clock size={16} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs opacity-90">距离下次接种</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tight">{daysLeft}</span>
            <span>天</span>
          </div>
        </div>
      </div>
      
      {/* 苹果风格的卡片底部指示器 */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center">
        <div className="w-10 h-1 bg-white/30 rounded-full"></div>
      </div>
    </div>
  );
} 
"use client";

import Link from "next/link";
import { Calendar, BookOpen, MapPin } from "lucide-react";

export function QuickActions() {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <Link 
        href="/add-schedule"
        className="flex flex-col items-center justify-center bg-white/80 backdrop-blur-md rounded-2xl shadow-apple-sm border border-white/20 p-4 text-center transition-all duration-300 hover:shadow-md"
      >
        <div className="w-12 h-12 rounded-full bg-sky-100/80 backdrop-blur-sm flex items-center justify-center text-sky-500 mb-2 shadow-sm">
          <Calendar size={20} />
        </div>
        <span className="text-xs text-slate-700 font-medium">接种时间表</span>
      </Link>
      
      <Link 
        href="/knowledge"
        className="flex flex-col items-center justify-center bg-white/80 backdrop-blur-md rounded-2xl shadow-apple-sm border border-white/20 p-4 text-center transition-all duration-300 hover:shadow-md"
      >
        <div className="w-12 h-12 rounded-full bg-green-100/80 backdrop-blur-sm flex items-center justify-center text-green-500 mb-2 shadow-sm">
          <BookOpen size={20} />
        </div>
        <span className="text-xs text-slate-700 font-medium">疫苗知识库</span>
      </Link>
      
      <Link 
        href="/locations"
        className="flex flex-col items-center justify-center bg-white/80 backdrop-blur-md rounded-2xl shadow-apple-sm border border-white/20 p-4 text-center transition-all duration-300 hover:shadow-md"
      >
        <div className="w-12 h-12 rounded-full bg-amber-100/80 backdrop-blur-sm flex items-center justify-center text-amber-500 mb-2 shadow-sm">
          <MapPin size={20} />
        </div>
        <span className="text-xs text-slate-700 font-medium">附近接种点</span>
      </Link>
    </div>
  );
} 
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  className?: string;
  right?: React.ReactNode;
}

export function PageHeader({ 
  title, 
  subtitle,
  showBackButton = false, 
  className,
  right
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className={cn("border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10", className)}>
      <div className="mx-auto px-4 sm:px-6 md:px-8 max-w-screen-2xl">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            {showBackButton && (
              <button 
                onClick={() => router.back()}
                className="p-1 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="返回"
              >
                <ChevronLeft className="h-5 w-5 text-slate-700" />
              </button>
            )}
            <div>
              <h1 className="text-lg font-medium">{title}</h1>
              {subtitle && (
                <p className="text-sm text-slate-500">{subtitle}</p>
              )}
            </div>
          </div>
          
          {right && (
            <div>
              {right}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
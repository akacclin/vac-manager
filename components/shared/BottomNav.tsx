'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: typeof Home;
}

const navItems: NavItem[] = [
  { name: '首页', href: '/', icon: Home },
  { name: '记录本', href: '/record', icon: BookOpen },
  { name: '我的', href: '/profile', icon: User }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white/80 backdrop-blur-lg border-t border-slate-200/80">
      <div className="max-w-screen-2xl mx-auto flex h-full items-center justify-around px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
                           (item.href !== '/' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3',
                isActive 
                  ? 'text-sky-500 font-medium' 
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <item.icon
                className={cn(
                  'h-5 w-5',
                  isActive ? 'text-sky-500' : 'text-slate-600'
                )}
              />
              <span className="text-xs">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 
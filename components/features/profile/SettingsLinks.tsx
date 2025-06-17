'use client';

import { ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

interface SettingLink {
  icon: React.ReactNode;
  title: string;
  href?: string;
  onClick?: () => void;
  badge?: string;
}

interface SettingsLinksProps {
  links: SettingLink[];
}

export function SettingsLinks({ links }: SettingsLinksProps) {
  return (
    <Card className="border border-slate-200 shadow-sm overflow-hidden">
      <div className="divide-y divide-slate-100">
        {links.map((link, index) => {
          const LinkWrapper = ({ children }: { children: React.ReactNode }) => 
            link.href ? (
              <Link href={link.href} className="block">{children}</Link>
            ) : (
              <button className="w-full text-left" onClick={link.onClick}>{children}</button>
            );
            
          return (
            <LinkWrapper key={index}>
              <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  {link.icon}
                  <span className="font-medium">{link.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  {link.badge && (
                    <span className="text-sm text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </LinkWrapper>
          );
        })}
      </div>
    </Card>
  );
} 
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Book, User } from "lucide-react";
import { BottomNav } from '@/components/shared/BottomNav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <main className="flex-1 pb-20">
        <div className="mx-auto h-full">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
} 
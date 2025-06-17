"use client";

import Link from "next/link";
import { Bell, ChevronDown } from "lucide-react";

interface WelcomeBarProps {
  memberName: string;
  hasNotification?: boolean;
  onMemberSelect?: () => void;
}

export function WelcomeBar({
  memberName,
  hasNotification = false,
  onMemberSelect,
}: WelcomeBarProps) {
  return (
    <div className="flex items-center justify-between p-5 bg-white/80 backdrop-blur-md rounded-2xl shadow-apple-sm border border-white/20 mb-6">
      <div className="flex items-center gap-2">
        <div className="flex flex-col">
          <span className="text-sm text-slate-500">你好，欢迎回来</span>
          <button
            onClick={onMemberSelect}
            className="flex items-center gap-1 text-lg font-semibold tracking-tight"
          >
            {memberName}
            <ChevronDown size={16} className="text-slate-400" />
          </button>
        </div>
      </div>
      
      <Link href="/messages" className="relative p-2 bg-slate-50/70 backdrop-blur-sm rounded-full">
        <Bell
          size={20}
          className={hasNotification ? "text-sky-500" : "text-slate-400"}
        />
        {hasNotification && (
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
        )}
      </Link>
    </div>
  );
} 
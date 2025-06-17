'use client';

import { useState } from 'react';
import { Check, ChevronDown, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cn, calculateAge } from '@/lib/utils';
import { FamilyMember } from '@/store/useAppStore';

interface MemberSwitcherProps {
  members: FamilyMember[];
  activeMember: FamilyMember | null;
  onMemberSelect: (memberId: string) => void;
}

export function MemberSwitcher({ members, activeMember, onMemberSelect }: MemberSwitcherProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  
  const handleAddMember = () => {
    router.push('/add-schedule');
  };

  return (
    <Card className="p-4 border border-slate-200 shadow-sm">
      <h3 className="font-medium text-base mb-3">家庭成员管理</h3>
      
      {/* 成员切换按钮 */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="选择一个家庭成员"
            className={cn(
              "w-full justify-between",
              !activeMember && "text-slate-400"
            )}
          >
            {activeMember ? (
              <div className="flex items-center gap-2">
                {activeMember.avatar && (
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-100 relative">
                    <Image
                      src={activeMember.avatar}
                      alt={activeMember.name}
                      fill
                      sizes="24px"
                      className="object-cover"
                    />
                  </div>
                )}
                <span>{activeMember.name}</span>
                <span className="text-slate-500 text-xs">
                  ({calculateAge(activeMember.birthDate)})
                </span>
              </div>
            ) : (
              "选择一个家庭成员"
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
          <div className="max-h-[250px] overflow-auto">
            {members.length > 0 ? (
              members.map((member) => (
                <div
                  key={member.id}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 cursor-pointer",
                    "hover:bg-slate-100 transition-colors",
                    member.id === activeMember?.id && "bg-slate-100"
                  )}
                  onClick={() => {
                    onMemberSelect(member.id);
                    setOpen(false);
                  }}
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 relative">
                    <Image
                      src={member.avatar || "/avatars/placeholder.png"}
                      alt={member.name}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{member.name}</div>
                    <div className="text-xs text-slate-500">
                      {calculateAge(member.birthDate)}
                    </div>
                  </div>
                  {member.id === activeMember?.id && (
                    <Check className="h-4 w-4 text-sky-500" />
                  )}
                </div>
              ))
            ) : (
              <div className="py-6 px-4 text-sm text-slate-500 text-center">
                暂无家庭成员
              </div>
            )}
          </div>
          
          {/* 添加成员按钮 */}
          <div className="border-t border-slate-100 p-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start font-normal"
              onClick={handleAddMember}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              添加新成员
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </Card>
  );
} 
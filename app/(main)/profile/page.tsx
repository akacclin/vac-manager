"use client";

import { PageHeader } from '@/components/shared/PageHeader';
import { MemberSwitcher } from '@/components/features/profile/MemberSwitcher';
import { SettingsLinks } from '@/components/features/profile/SettingsLinks';
import { useFamilyMembers } from '@/lib/hooks/useMembers';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Bell, HelpCircle, Settings, UserPlus, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { members, activeMember, setActiveMember, loading } = useFamilyMembers();
  const router = useRouter();
  
  const settingsLinks = [
    {
      icon: <Bell className="h-5 w-5 text-slate-500" />,
      title: '提醒设置',
      href: '/settings/notifications'
    },
    {
      icon: <HelpCircle className="h-5 w-5 text-slate-500" />,
      title: '使用帮助',
      href: '/help'
    },
    {
      icon: <AlertCircle className="h-5 w-5 text-slate-500" />,
      title: '关于我们',
      href: '/about'
    },
    {
      icon: <Settings className="h-5 w-5 text-slate-500" />,
      title: '系统设置',
      href: '/settings'
    }
  ];
  
  const handleAddMember = () => {
    router.push('/add-schedule');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <PageHeader title="我的" />
      
      <div className="flex-1 overflow-auto">
        <div className="mx-auto px-4 sm:px-6 md:px-8 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl py-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-full py-12">
              <p className="text-slate-500">加载中...</p>
            </div>
          ) : members.length === 0 ? (
            <EmptyState
              icon={UserPlus}
              title="添加宝宝信息"
              description="添加宝宝信息以管理疫苗接种计划"
              action={
                <Button onClick={handleAddMember}>
                  添加家庭成员
                </Button>
              }
            />
          ) : (
            <>
              <MemberSwitcher
                members={members}
                activeMember={activeMember}
                onMemberSelect={setActiveMember}
              />
              
              <div className="mt-6">
                <h3 className="font-medium text-sm text-slate-500 mb-2 px-1">设置与支持</h3>
                <SettingsLinks links={settingsLinks} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 
'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/EmptyState';
import { MessageSquare, Syringe } from 'lucide-react';
import { useState } from 'react';

interface Message {
  id: string;
  title: string;
  content: string;
  date: string;
  read: boolean;
  type: 'system' | 'reminder' | 'notification';
}

// 模拟的消息数据
const mockMessages: Message[] = [
  {
    id: '1',
    title: '接种提醒 - 五联疫苗',
    content: '您的宝宝将于3天后（6月15日）需要接种五联疫苗，请及时前往接种点进行接种。',
    date: '2024-06-12',
    read: false,
    type: 'reminder'
  },
  {
    id: '2',
    title: '接种已过期提醒',
    content: '您的宝宝的麻腮风疫苗接种已过期5天，请尽快前往接种点进行接种。',
    date: '2024-06-10',
    read: false,
    type: 'reminder'
  },
  {
    id: '3',
    title: '系统通知 - 新增疫苗信息',
    content: '系统已更新了最新的疫苗接种指南，请查看知识库了解更多信息。',
    date: '2024-06-08',
    read: true,
    type: 'system'
  },
  {
    id: '4',
    title: '接种记录已添加',
    content: '您已成功添加宝宝的乙肝疫苗接种记录。',
    date: '2024-05-30',
    read: true,
    type: 'notification'
  }
];

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  // 消息已读功能
  const handleMessageClick = (id: string) => {
    setMessages(
      messages.map((message) => 
        message.id === id ? { ...message, read: true } : message
      )
    );
  };
  
  // 获取未读消息数量
  const unreadCount = messages.filter(message => !message.read).length;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <PageHeader 
        title="消息中心" 
        showBackButton
        right={
          unreadCount > 0 && (
            <Badge className="bg-sky-500">
              {unreadCount}个未读
            </Badge>
          )
        }
      />
      
      <div className="flex-1 p-4 overflow-auto">
        {messages.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="暂无消息"
            description="您当前没有任何消息通知"
          />
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <Card
                key={message.id}
                className={`p-4 cursor-pointer ${!message.read ? 'bg-sky-50 border-sky-100' : ''}`}
                onClick={() => handleMessageClick(message.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${!message.read ? 'bg-sky-500' : 'bg-transparent'}`} />
                    <h3 className={`font-medium ${!message.read ? 'text-slate-900' : 'text-slate-700'}`}>
                      {message.title}
                    </h3>
                  </div>
                  <div className="text-xs text-slate-500">{message.date}</div>
                </div>
                
                <p className={`text-sm ${!message.read ? 'text-slate-700' : 'text-slate-500'}`}>
                  {message.content}
                </p>
                
                <div className="flex justify-end mt-2">
                  <Badge variant={
                    message.type === 'reminder' ? 'default' : 
                    message.type === 'system' ? 'secondary' : 'outline'
                  } className={
                    message.type === 'reminder' ? 'bg-sky-500' : 
                    message.type === 'system' ? 'bg-slate-500' : ''
                  }>
                    {message.type === 'reminder' ? '接种提醒' : 
                     message.type === 'system' ? '系统通知' : '记录通知'}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
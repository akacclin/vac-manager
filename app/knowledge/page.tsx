'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/shared/PageHeader';
import { VaccineCard } from './_components/VaccineCard';

interface Vaccine {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  schedule: string;
}

export default function KnowledgeBasePage() {
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [filteredVaccines, setFilteredVaccines] = useState<Vaccine[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 直接从JSON文件获取数据，因为API路径可能有问题
        const response = await fetch('/api/knowledge-base');
        
        if (!response.ok) {
          throw new Error(`API请求失败，状态码: ${response.status}`);
        }
        
        const data = await response.json();
        
        // 确保我们得到的是预期格式的数据
        if (!data.vaccines || !Array.isArray(data.vaccines)) {
          console.error('返回的数据格式不符合预期:', data);
          throw new Error('返回的数据格式不符合预期');
        }
        
        setVaccines(data.vaccines);
        setFilteredVaccines(data.vaccines);
      } catch (err) {
        console.error('获取疫苗数据失败', err);
        setError('获取疫苗数据失败，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVaccines();
  }, []);

  // 处理搜索和分类过滤
  useEffect(() => {
    let result = [...vaccines];
    
    // 根据搜索词过滤
    if (searchQuery) {
      result = result.filter(
        vaccine => 
          vaccine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vaccine.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // 根据分类过滤
    if (activeTab !== 'all') {
      result = result.filter(vaccine => vaccine.category === (activeTab === 'category1' ? '一类疫苗' : '二类疫苗'));
    }
    
    setFilteredVaccines(result);
  }, [searchQuery, activeTab, vaccines]);

  return (
    <div className="container mx-auto max-w-md">
      <PageHeader 
        title="疫苗知识库" 
        subtitle="了解各种疫苗的知识，做出明智的接种决定"
        showBackButton 
        backUrl="/"
      />

      <div className="px-4">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="搜索疫苗..." 
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="category1">一类疫苗</TabsTrigger>
            <TabsTrigger value="category2">二类疫苗</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-slate-100 h-40 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              重试
            </Button>
          </div>
        ) : filteredVaccines.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredVaccines.map(vaccine => (
              <Link href={`/knowledge/${vaccine.slug}`} key={vaccine.id}>
                <VaccineCard vaccine={vaccine} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-slate-700">没有找到相关疫苗</h3>
            <p className="text-slate-500 mt-1">请尝试使用其他关键词搜索</p>
          </div>
        )}
      </div>
    </div>
  );
} 
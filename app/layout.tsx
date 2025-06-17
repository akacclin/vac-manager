import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { AMAP_KEY, setupAmapSecurity } from '@/lib/amap';

// 使用Inter字体
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '疫苗接种管理',
  description: '管理和跟踪您家人的疫苗接种计划',
};

// 在客户端组件中设置高德地图安全密钥的脚本
const AmapSecurityScript = () => {
  return (
    <Script id="amap-security-setup" strategy="beforeInteractive">
      {`
        window._AMapSecurityConfig = {
          securityJsCode: 'e304c0676e2e510e4ea17b8ad35fd4bd',
        };
      `}
    </Script>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <AmapSecurityScript />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

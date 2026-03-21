import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/sidebar/Sidebar'

export const metadata: Metadata = {
  title: 'AI Chat - 社内アシスタント',
  description: '社内従業員向け汎用AIアシスタント',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="h-full">
      <body className="h-full flex overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden md:pt-0 pt-14">
          {children}
        </main>
      </body>
    </html>
  )
}

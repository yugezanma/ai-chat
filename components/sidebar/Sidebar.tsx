'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ConversationList from './ConversationList'

export default function Sidebar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleNewChat = async () => {
    const res = await fetch('/api/conversations', { method: 'POST' })
    const conversation = await res.json()
    router.push(`/${conversation.id}`)
    setIsOpen(false)
  }

  return (
    <>
      {/* モバイル：ハンバーガーボタン */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg"
        style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="メニューを開く"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <rect y="3" width="20" height="2" rx="1" />
          <rect y="9" width="20" height="2" rx="1" />
          <rect y="15" width="20" height="2" rx="1" />
        </svg>
      </button>

      {/* モバイル：オーバーレイ */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-30"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* サイドバー本体 */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-full z-40
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{
          width: 'var(--sidebar-width)',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border)',
        }}
      >
        {/* ヘッダー */}
        <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-bold"
              style={{ background: 'var(--accent)' }}
            >
              A
            </div>
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              AI Chat
            </span>
          </div>

          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
            style={{
              background: 'var(--accent)',
              color: '#fff',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--accent)')}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="2" x2="8" y2="14" />
              <line x1="2" y1="8" x2="14" y2="8" />
            </svg>
            新しい会話
          </button>
        </div>

        {/* 会話一覧 */}
        <div className="flex-1 overflow-y-auto p-2">
          <p className="px-2 py-1.5 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
            会話履歴
          </p>
          <ConversationList onSelect={() => setIsOpen(false)} />
        </div>
      </aside>
    </>
  )
}

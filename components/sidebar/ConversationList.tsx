'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import type { Conversation } from '@/types'

function SkeletonList() {
  return (
    <ul className="space-y-1">
      {[80, 60, 72, 50].map((w, i) => (
        <li key={i} className="px-3 py-2.5">
          <div className="skeleton h-3.5 rounded" style={{ width: `${w}%` }} />
        </li>
      ))}
    </ul>
  )
}

export default function ConversationList({ onSelect }: { onSelect?: () => void }) {
  const router = useRouter()
  const params = useParams()
  const activeId = params?.conversationId as string | undefined

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchConversations = useCallback(async () => {
    const res = await fetch('/api/conversations')
    const data = await res.json()
    setConversations(data)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations, activeId])

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    await fetch(`/api/conversations/${id}`, { method: 'DELETE' })
    setConversations((prev) => prev.filter((c) => c.id !== id))
    if (activeId === id) router.push('/')
  }

  if (isLoading) return <SkeletonList />

  if (conversations.length === 0) {
    return (
      <div className="px-3 py-4 text-center">
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          まだ会話がありません
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>
          新しい会話を始めましょう
        </p>
      </div>
    )
  }

  return (
    <ul className="space-y-0.5">
      {conversations.map((c) => (
        <li key={c.id}>
          <button
            onClick={() => { router.push(`/${c.id}`); onSelect?.() }}
            className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm text-left group transition-colors duration-100"
            style={{
              background: activeId === c.id ? 'var(--bg-hover)' : 'transparent',
              color: activeId === c.id ? 'var(--text-primary)' : 'var(--text-secondary)',
            }}
            onMouseEnter={(e) => {
              if (activeId !== c.id) e.currentTarget.style.background = 'var(--bg-tertiary)'
            }}
            onMouseLeave={(e) => {
              if (activeId !== c.id) e.currentTarget.style.background = 'transparent'
            }}
          >
            <span className="truncate flex-1">{c.title}</span>
            <span
              onClick={(e) => handleDelete(e, c.id)}
              className="opacity-0 group-hover:opacity-100 p-1 rounded-md transition-opacity flex-shrink-0"
              style={{ color: 'var(--text-secondary)' }}
              role="button"
              aria-label="削除"
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 3.5h10M5 3.5V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1M5.5 6v4M8.5 6v4M3 3.5l.7 7.5a.5.5 0 00.5.5h5.6a.5.5 0 00.5-.5L11 3.5" />
              </svg>
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

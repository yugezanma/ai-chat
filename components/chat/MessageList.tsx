'use client'

import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import type { Message } from '@/types'

type Props = {
  messages: Message[]
  isLoading?: boolean
}

export default function MessageList({ messages, isLoading = false }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8">
        {/* ロゴ */}
        <div className="relative">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg"
            style={{ background: 'linear-gradient(135deg, var(--accent), #a78bfa)' }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path
                d="M6 22L12 10l4 8 3-5 5 9"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 flex items-center justify-center"
            style={{ background: '#22c55e', borderColor: 'var(--bg-primary)' }}
          >
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
        </div>

        {/* テキスト */}
        <div className="text-center space-y-1.5">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            何でも聞いてください
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            社内アシスタントがサポートします
          </p>
        </div>

        {/* ヒントカード */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md mt-2">
          {[
            { icon: '📝', text: '文章の作成・添削' },
            { icon: '🔍', text: '情報の調査・まとめ' },
            { icon: '💻', text: 'コードの作成・レビュー' },
            { icon: '💡', text: 'アイデアのブレスト' },
          ].map((hint) => (
            <div
              key={hint.text}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
              }}
            >
              <span>{hint.icon}</span>
              <span>{hint.text}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

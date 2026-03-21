'use client'

import { useState, useRef, useCallback } from 'react'

type Props = {
  onSend: (content: string) => Promise<void>
  isLoading: boolean
}

export default function ChatInput({ onSend, isLoading }: Props) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = useCallback(async () => {
    const trimmed = value.trim()
    if (!trimmed || isLoading) return
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    await onSend(trimmed)
  }, [value, isLoading, onSend])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }

  return (
    <div className="px-4 pb-6 pt-2">
      <div
        className="max-w-3xl mx-auto flex items-end gap-3 px-4 py-3 rounded-2xl transition-all duration-150"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          boxShadow: '0 0 0 0 transparent',
        }}
        onFocusCapture={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent)'
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,106,247,0.15)'
        }}
        onBlurCapture={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.boxShadow = '0 0 0 0 transparent'
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="メッセージを入力… (Shift+Enter で改行)"
          rows={1}
          disabled={isLoading}
          className="flex-1 resize-none bg-transparent text-sm outline-none leading-relaxed"
          style={{
            color: 'var(--text-primary)',
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || isLoading}
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150"
          style={{
            background: value.trim() && !isLoading ? 'var(--accent)' : 'var(--bg-tertiary)',
            color: value.trim() && !isLoading ? '#fff' : 'var(--text-secondary)',
            cursor: value.trim() && !isLoading ? 'pointer' : 'not-allowed',
          }}
          aria-label="送信"
        >
          {isLoading ? (
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 8h12M9 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>
      <p className="text-center text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
        Enter で送信 / Shift+Enter で改行
      </p>
    </div>
  )
}

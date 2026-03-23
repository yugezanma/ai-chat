'use client'

import { useState, useCallback } from 'react'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import type { Message, SendMessageResponse } from '@/types'

type Props = {
  conversationId: string
  initialMessages: Message[]
}

export default function ChatWindow({ conversationId, initialMessages }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = useCallback(async (content: string) => {
    setIsLoading(true)

    // 楽観的UIアップデート
    const optimisticUser: Message = {
      id: `temp-${Date.now()}`,
      conversationId,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, optimisticUser])

    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      if (!res.ok) throw new Error('送信に失敗しました')

      const data: SendMessageResponse = await res.json()

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== optimisticUser.id),
        data.userMessage,
        data.assistantMessage,
      ])
    } catch (err) {
      console.error(err)
      setMessages((prev) => prev.filter((m) => m.id !== optimisticUser.id))
    } finally {
      setIsLoading(false)
    }
  }, [conversationId])

  return (
    <div className="flex flex-col h-full">
      <MessageList messages={messages} isLoading={isLoading} />
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  )
}

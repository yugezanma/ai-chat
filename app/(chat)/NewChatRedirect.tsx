'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ChatInput from '@/components/chat/ChatInput'

export default function NewChatRedirect() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async (content: string) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/conversations', { method: 'POST' })
      const conversation = await res.json()

      await fetch(`/api/conversations/${conversation.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      router.push(`/${conversation.id}`)
    } finally {
      setIsLoading(false)
    }
  }

  return <ChatInput onSend={handleSend} isLoading={isLoading} />
}

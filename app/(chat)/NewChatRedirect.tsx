'use client'

import { useRouter } from 'next/navigation'
import ChatInput from '@/components/chat/ChatInput'

export default function NewChatRedirect() {
  const router = useRouter()

  const handleSend = async (content: string) => {
    const res = await fetch('/api/conversations', { method: 'POST' })
    const conversation = await res.json()

    await fetch(`/api/conversations/${conversation.id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })

    router.push(`/${conversation.id}`)
  }

  return <ChatInput onSend={handleSend} isLoading={false} />
}

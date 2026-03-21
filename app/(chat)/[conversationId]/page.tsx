import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ChatWindow from '@/components/chat/ChatWindow'
import type { Message } from '@/types'

type Props = {
  params: Promise<{ conversationId: string }>
}

export default async function ConversationPage({ params }: Props) {
  const { conversationId } = await params

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  })

  if (!conversation) notFound()

  const dbMessages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
  })

  const messages: Message[] = dbMessages.map((m) => ({
    id: m.id,
    conversationId: m.conversationId,
    role: m.role as 'user' | 'assistant',
    content: m.content,
    createdAt: m.createdAt.toISOString(),
  }))

  return <ChatWindow conversationId={conversationId} initialMessages={messages} />
}

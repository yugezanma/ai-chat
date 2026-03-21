import { Hono } from 'hono'
import { prisma } from '@/lib/prisma'
import { assistantAgent } from '@/lib/mastra'

const messages = new Hono()

// GET /api/conversations/:id/messages - メッセージ一覧取得
messages.get('/:id/messages', async (c) => {
  const conversationId = c.req.param('id')
  const data = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
  })
  return c.json(data)
})

// POST /api/conversations/:id/messages - メッセージ送信・AI返答取得
messages.post('/:id/messages', async (c) => {
  const conversationId = c.req.param('id')
  const { content } = await c.req.json<{ content: string }>()

  if (!content?.trim()) {
    return c.json({ error: 'メッセージを入力してください' }, 400)
  }

  // ユーザーメッセージを保存
  const userMessage = await prisma.message.create({
    data: { conversationId, role: 'user', content },
  })

  // 過去のメッセージ履歴を取得してエージェントに渡す
  const history = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
  })

  const historyMessages = history.map((m) =>
    m.role === 'assistant'
      ? ({ role: 'assistant' as const, content: m.content })
      : ({ role: 'user' as const, content: m.content })
  )

  // Mastra エージェントで応答生成
  const response = await assistantAgent.generate(historyMessages)
  const assistantContent = response.text

  // アシスタントメッセージを保存
  const assistantMessage = await prisma.message.create({
    data: { conversationId, role: 'assistant', content: assistantContent },
  })

  // 初回メッセージなら会話タイトルを更新
  const messageCount = await prisma.message.count({ where: { conversationId } })
  if (messageCount <= 2) {
    const title = content.length > 30 ? content.slice(0, 30) + '…' : content
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { title },
    })
  }

  return c.json({ userMessage, assistantMessage }, 201)
})

export default messages

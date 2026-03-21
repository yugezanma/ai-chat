import { Hono } from 'hono'
import { prisma } from '@/lib/prisma'

const conversations = new Hono()

// GET /api/conversations - 会話一覧取得
conversations.get('/', async (c) => {
  const data = await prisma.conversation.findMany({
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
    },
  })
  return c.json(data)
})

// POST /api/conversations - 新規会話作成
conversations.post('/', async (c) => {
  const conversation = await prisma.conversation.create({
    data: { title: '新しい会話' },
  })
  return c.json(conversation, 201)
})

// DELETE /api/conversations/:id - 会話削除
conversations.delete('/:id', async (c) => {
  const id = c.req.param('id')
  await prisma.conversation.delete({ where: { id } })
  return c.json({ success: true })
})

export default conversations

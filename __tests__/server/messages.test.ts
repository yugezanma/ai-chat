import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockPrisma = {
  message: {
    findMany: vi.fn(),
    create: vi.fn(),
    count: vi.fn(),
  },
  conversation: {
    update: vi.fn(),
  },
}

const mockAgent = {
  generate: vi.fn(),
}

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }))
vi.mock('@/lib/mastra', () => ({ assistantAgent: mockAgent }))

const { default: app } = await import('../../server/index')

const CONV_ID = 'conv-abc'

describe('GET /api/conversations/:id/messages', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('指定した会話のメッセージ一覧を返す', async () => {
    const mockMessages = [
      { id: 'm-1', conversationId: CONV_ID, role: 'user', content: 'こんにちは', createdAt: new Date() },
      { id: 'm-2', conversationId: CONV_ID, role: 'assistant', content: 'どうぞ', createdAt: new Date() },
    ]
    mockPrisma.message.findMany.mockResolvedValue(mockMessages)

    const res = await app.request(`/api/conversations/${CONV_ID}/messages`)

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveLength(2)
    expect(body[0].role).toBe('user')
    expect(body[1].role).toBe('assistant')
  })
})

describe('POST /api/conversations/:id/messages', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('メッセージを送信してAI返答を含むレスポンスを返す', async () => {
    const userMsg = { id: 'u-1', conversationId: CONV_ID, role: 'user', content: 'テスト', createdAt: new Date() }
    const aiMsg   = { id: 'a-1', conversationId: CONV_ID, role: 'assistant', content: 'AIの返答', createdAt: new Date() }

    mockPrisma.message.create
      .mockResolvedValueOnce(userMsg)
      .mockResolvedValueOnce(aiMsg)
    mockPrisma.message.findMany.mockResolvedValue([userMsg])
    mockPrisma.message.count.mockResolvedValue(2)
    mockPrisma.conversation.update.mockResolvedValue({})
    mockAgent.generate.mockResolvedValue({ text: 'AIの返答' })

    const res = await app.request(`/api/conversations/${CONV_ID}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'テスト' }),
    })

    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.userMessage.content).toBe('テスト')
    expect(body.assistantMessage.content).toBe('AIの返答')
    expect(mockAgent.generate).toHaveBeenCalledOnce()
  })

  it('空のメッセージは400を返す', async () => {
    const res = await app.request(`/api/conversations/${CONV_ID}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: '   ' }),
    })

    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBeDefined()
    expect(mockAgent.generate).not.toHaveBeenCalled()
  })

  it('初回メッセージ（2件以下）で会話タイトルが更新される', async () => {
    const userMsg = { id: 'u-1', conversationId: CONV_ID, role: 'user', content: 'タイトルになるメッセージ', createdAt: new Date() }
    const aiMsg   = { id: 'a-1', conversationId: CONV_ID, role: 'assistant', content: '返答', createdAt: new Date() }

    mockPrisma.message.create
      .mockResolvedValueOnce(userMsg)
      .mockResolvedValueOnce(aiMsg)
    mockPrisma.message.findMany.mockResolvedValue([userMsg])
    mockPrisma.message.count.mockResolvedValue(2)
    mockPrisma.conversation.update.mockResolvedValue({})
    mockAgent.generate.mockResolvedValue({ text: '返答' })

    await app.request(`/api/conversations/${CONV_ID}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'タイトルになるメッセージ' }),
    })

    expect(mockPrisma.conversation.update).toHaveBeenCalledWith({
      where: { id: CONV_ID },
      data: { title: 'タイトルになるメッセージ' },
    })
  })

  it('30文字を超えるメッセージはタイトルが省略される', async () => {
    const longContent = 'あ'.repeat(35)
    const userMsg = { id: 'u-1', conversationId: CONV_ID, role: 'user', content: longContent, createdAt: new Date() }
    const aiMsg   = { id: 'a-1', conversationId: CONV_ID, role: 'assistant', content: '返答', createdAt: new Date() }

    mockPrisma.message.create
      .mockResolvedValueOnce(userMsg)
      .mockResolvedValueOnce(aiMsg)
    mockPrisma.message.findMany.mockResolvedValue([userMsg])
    mockPrisma.message.count.mockResolvedValue(2)
    mockPrisma.conversation.update.mockResolvedValue({})
    mockAgent.generate.mockResolvedValue({ text: '返答' })

    await app.request(`/api/conversations/${CONV_ID}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: longContent }),
    })

    const updateCall = mockPrisma.conversation.update.mock.calls[0][0]
    expect(updateCall.data.title).toHaveLength(31) // 30文字 + '…'
    expect(updateCall.data.title.endsWith('…')).toBe(true)
  })
})

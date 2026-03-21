import { describe, it, expect, vi, beforeEach } from 'vitest'

// Prisma をモック
const mockPrisma = {
  conversation: {
    findMany: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
}

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }))

// モック後にインポート
const { default: app } = await import('../../server/index')

describe('GET /api/conversations', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('会話一覧を返す', async () => {
    const mockConversations = [
      { id: 'id-1', title: 'テスト会話', createdAt: new Date(), updatedAt: new Date() },
    ]
    mockPrisma.conversation.findMany.mockResolvedValue(mockConversations)

    const res = await app.request('/api/conversations')

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body)).toBe(true)
    expect(body).toHaveLength(1)
    expect(body[0].id).toBe('id-1')
    expect(body[0].title).toBe('テスト会話')
  })

  it('会話が0件のとき空配列を返す', async () => {
    mockPrisma.conversation.findMany.mockResolvedValue([])

    const res = await app.request('/api/conversations')

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual([])
  })
})

describe('POST /api/conversations', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('新規会話を作成して201を返す', async () => {
    const newConversation = { id: 'new-id', title: '新しい会話', createdAt: new Date(), updatedAt: new Date() }
    mockPrisma.conversation.create.mockResolvedValue(newConversation)

    const res = await app.request('/api/conversations', { method: 'POST' })

    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.id).toBe('new-id')
    expect(body.title).toBe('新しい会話')
    expect(mockPrisma.conversation.create).toHaveBeenCalledOnce()
  })
})

describe('DELETE /api/conversations/:id', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('指定した会話を削除してsuccess:trueを返す', async () => {
    mockPrisma.conversation.delete.mockResolvedValue({ id: 'del-id' })

    const res = await app.request('/api/conversations/del-id', { method: 'DELETE' })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(mockPrisma.conversation.delete).toHaveBeenCalledWith({ where: { id: 'del-id' } })
  })
})

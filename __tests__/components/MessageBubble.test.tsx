import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MessageBubble from '@/components/chat/MessageBubble'
import type { Message } from '@/types'

const baseMessage: Message = {
  id: 'msg-1',
  conversationId: 'conv-1',
  content: 'テストメッセージ',
  createdAt: new Date().toISOString(),
  role: 'user',
}

describe('MessageBubble - ユーザーメッセージ', () => {
  it('メッセージ内容が表示される', () => {
    render(<MessageBubble message={baseMessage} />)
    expect(screen.getByText('テストメッセージ')).toBeInTheDocument()
  })

  it('アバターに "U" が表示される', () => {
    render(<MessageBubble message={baseMessage} />)
    expect(screen.getByText('U')).toBeInTheDocument()
  })
})

describe('MessageBubble - アシスタントメッセージ', () => {
  const aiMessage: Message = { ...baseMessage, role: 'assistant', content: 'AIからの返答です' }

  it('アシスタントのメッセージ内容が表示される', () => {
    render(<MessageBubble message={aiMessage} />)
    expect(screen.getByText('AIからの返答です')).toBeInTheDocument()
  })

  it('アバターに "AI" が表示される', () => {
    render(<MessageBubble message={aiMessage} />)
    expect(screen.getByText('AI')).toBeInTheDocument()
  })

  it('マークダウンのコードブロックがレンダリングされる', () => {
    const codeMessage: Message = {
      ...aiMessage,
      content: '```js\nconsole.log("hello")\n```',
    }
    const { container } = render(<MessageBubble message={codeMessage} />)
    // シンタックスハイライターはトークンを分割するため、code要素の存在を検証する
    const codeEl = container.querySelector('code.language-js')
    expect(codeEl).toBeInTheDocument()
    expect(codeEl?.textContent).toContain('console')
    expect(codeEl?.textContent).toContain('log')
  })

  it('マークダウンの見出しがレンダリングされる', () => {
    const headingMessage: Message = {
      ...aiMessage,
      content: '## 見出し\n本文テキスト',
    }
    render(<MessageBubble message={headingMessage} />)
    expect(screen.getByRole('heading', { level: 2, name: '見出し' })).toBeInTheDocument()
  })
})

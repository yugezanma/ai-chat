import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChatInput from '@/components/chat/ChatInput'

describe('ChatInput', () => {
  it('プレースホルダーが表示される', () => {
    render(<ChatInput onSend={vi.fn()} isLoading={false} />)
    expect(screen.getByPlaceholderText(/メッセージを入力/)).toBeInTheDocument()
  })

  it('テキスト入力ができる', async () => {
    const user = userEvent.setup()
    render(<ChatInput onSend={vi.fn()} isLoading={false} />)
    const textarea = screen.getByPlaceholderText(/メッセージを入力/)
    await user.type(textarea, 'こんにちは')
    expect(textarea).toHaveValue('こんにちは')
  })

  it('Enterキーで onSend が呼ばれる', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn().mockResolvedValue(undefined)
    render(<ChatInput onSend={onSend} isLoading={false} />)
    const textarea = screen.getByPlaceholderText(/メッセージを入力/)
    await user.type(textarea, 'テスト{Enter}')
    expect(onSend).toHaveBeenCalledWith('テスト')
  })

  it('Shift+Enter では送信されず改行される', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()
    render(<ChatInput onSend={onSend} isLoading={false} />)
    const textarea = screen.getByPlaceholderText(/メッセージを入力/)
    await user.type(textarea, 'テスト{Shift>}{Enter}{/Shift}')
    expect(onSend).not.toHaveBeenCalled()
  })

  it('IME変換中（isComposing）のEnterでは送信されない', async () => {
    const onSend = vi.fn()
    render(<ChatInput onSend={onSend} isLoading={false} />)
    const textarea = screen.getByPlaceholderText(/メッセージを入力/)

    // isComposing=true の KeyDown イベントを発火
    textarea.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        isComposing: true,
      })
    )
    expect(onSend).not.toHaveBeenCalled()
  })

  it('空白のみのメッセージは送信されない', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()
    render(<ChatInput onSend={onSend} isLoading={false} />)
    const textarea = screen.getByPlaceholderText(/メッセージを入力/)
    await user.type(textarea, '   {Enter}')
    expect(onSend).not.toHaveBeenCalled()
  })

  it('ローディング中はテキストエリアが無効化される', () => {
    render(<ChatInput onSend={vi.fn()} isLoading={true} />)
    expect(screen.getByPlaceholderText(/メッセージを入力/)).toBeDisabled()
  })

  it('ローディング中は送信してもonSendが呼ばれない', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()
    render(<ChatInput onSend={onSend} isLoading={true} />)
    const btn = screen.getByRole('button', { name: '送信' })
    await user.click(btn)
    expect(onSend).not.toHaveBeenCalled()
  })

  it('送信後に入力欄がクリアされる', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn().mockResolvedValue(undefined)
    render(<ChatInput onSend={onSend} isLoading={false} />)
    const textarea = screen.getByPlaceholderText(/メッセージを入力/)
    await user.type(textarea, 'テスト{Enter}')
    expect(textarea).toHaveValue('')
  })
})

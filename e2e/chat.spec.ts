import { test, expect } from '@playwright/test'

test.describe('チャットアプリ基本フロー', () => {
  test('トップページが表示される', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('何でも聞いてください')).toBeVisible()
  })

  test('サイドバーに「新しい会話」ボタンが表示される', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: '新しい会話' })).toBeVisible()
  })

  test('入力フォームが表示される', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByPlaceholder(/メッセージを入力/)).toBeVisible()
  })

  test('メッセージを入力して送信ボタンが有効になる', async ({ page }) => {
    await page.goto('/')
    const textarea = page.getByPlaceholder(/メッセージを入力/)
    await textarea.fill('テストメッセージ')
    const sendBtn = page.getByRole('button', { name: '送信' })
    await expect(sendBtn).toBeEnabled()
  })

  test('空のメッセージでは送信ボタンが無効のまま', async ({ page }) => {
    await page.goto('/')
    const sendBtn = page.getByRole('button', { name: '送信' })
    await expect(sendBtn).toBeDisabled()
  })

  test('モバイル幅でハンバーガーボタンが表示される', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await expect(page.getByLabel('メニューを開く')).toBeVisible()
  })

  test('モバイル幅でハンバーガーをクリックするとサイドバーが開く', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.getByLabel('メニューを開く').click()
    await expect(page.getByRole('button', { name: '新しい会話' })).toBeVisible()
  })
})

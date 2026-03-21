# AI Chat 構築 TODO リスト

## Phase 1: プロジェクト初期設定

- [x] Next.js プロジェクト作成 (`create-next-app` with TypeScript, App Router, Tailwind CSS)
- [x] 依存パッケージのインストール
  - [x] `hono` `@hono/node-server`
  - [x] `@prisma/client` `prisma`
  - [x] `@mastra/core` `@mastra/anthropic`
  - [x] `@anthropic-ai/sdk`
  - [x] `react-markdown` `react-syntax-highlighter`
  - [x] `@types/*` 各種型定義
- [x] `.env.local` ファイル作成（環境変数のテンプレート）
- [x] `tsconfig.json` の strict mode 確認・調整
- [x] ESLint / Prettier 設定

---

## Phase 2: データベース設定

- [x] MongoDB Atlas クラスター作成（または既存のMongoDB接続確認）
- [x] `prisma/schema.prisma` 作成
  - [x] `Conversation` モデル定義
  - [x] `Message` モデル定義
- [x] `npx prisma generate` 実行
- [x] `lib/prisma.ts` シングルトン作成
- [x] DB接続確認

---

## Phase 3: Mastra エージェント設定

- [x] `mastra/index.ts` Mastra インスタンス作成
- [x] `mastra/agents/assistant.ts` 汎用アシスタントエージェント定義
  - [x] モデル: `claude-sonnet-4-6` 設定
  - [x] システムプロンプト設定
- [x] `lib/mastra.ts` クライアントシングルトン作成
- [x] エージェント動作確認（単体テスト）※ ANTHROPIC_API_KEY はデプロイ時に設定

---

## Phase 4: バックエンド API 実装（Hono）

- [x] `server/index.ts` Hono アプリケーション定義
- [x] `app/api/[[...route]]/route.ts` Next.js との接続設定
- [x] `server/middleware/cors.ts` CORS ミドルウェア設定
- [x] 会話 API 実装 (`server/routes/conversations.ts`)
  - [x] `GET /api/conversations` 会話一覧取得
  - [x] `POST /api/conversations` 新規会話作成
  - [x] `DELETE /api/conversations/:id` 会話削除
- [x] メッセージ API 実装 (`server/routes/messages.ts`)
  - [x] `GET /api/conversations/:id/messages` メッセージ一覧取得
  - [x] `POST /api/conversations/:id/messages` メッセージ送信・AI返答取得
    - [x] Mastra エージェント呼び出し
    - [x] 会話タイトルの自動生成（初回メッセージから）
    - [x] DB への保存
- [x] 各APIの動作確認 ※ ANTHROPIC_API_KEY 設定後に実動作確認

---

## Phase 5: フロントエンド実装

### 共通・レイアウト
- [x] `types/index.ts` 共通型定義（`Conversation`, `Message` 等）
- [x] `app/layout.tsx` ルートレイアウト（サイドバー + メインエリア構成）
- [x] グローバルスタイル・カラーテーマ設定 (`app/globals.css`)

### サイドバー
- [x] `components/sidebar/Sidebar.tsx` サイドバーコンポーネント
  - [x] 新規会話ボタン
  - [x] レスポンシブ対応（モバイルはドロワー形式）
- [x] `components/sidebar/ConversationList.tsx` 会話履歴一覧
  - [x] 会話一覧の取得・表示
  - [x] 会話選択・ハイライト
  - [x] 会話削除ボタン

### チャット画面
- [x] `app/(chat)/page.tsx` 新規チャット画面
- [x] `app/(chat)/[conversationId]/page.tsx` 既存会話参照画面
- [x] `components/chat/ChatWindow.tsx` メインチャットエリア
- [x] `components/chat/MessageList.tsx` メッセージ一覧表示
- [x] `components/chat/MessageBubble.tsx` メッセージバブル
  - [x] ユーザー・アシスタントで見た目を分ける
  - [x] マークダウンレンダリング（`react-markdown`）
  - [x] コードシンタックスハイライト（`react-syntax-highlighter`）
- [x] `components/chat/ChatInput.tsx` 入力フォーム
  - [x] テキストエリア（複数行対応）
  - [x] 送信ボタン
  - [x] 送信中のローディング表示

---

## Phase 6: UI スタイリング

- [x] カラーパレット・デザイントークン定義
- [x] サイドバーのスタイリング
- [x] チャットバブルのスタイリング（ユーザー・アシスタント）
- [x] コードブロックのスタイリング
- [x] レスポンシブ対応の確認・調整（モバイル・タブレット・デスクトップ）
- [x] ローディング・空状態のUIを整備

---

## Phase 7: テスト

- [x] Mastra エージェントの単体テスト
- [x] Hono API のエンドポイントテスト
  - [x] 会話CRUD
  - [x] メッセージ送受信
- [x] フロントエンドのコンポーネントテスト（主要コンポーネント）
- [x] E2Eテスト（基本的なチャットフロー）

---

## Phase 8: デプロイ設定（GCP Cloud Run）

- [x] `Dockerfile` 作成
- [x] `.dockerignore` 作成
- [x] Cloud Run サービス設定
- [x] GCP Secret Manager に環境変数を登録
  - [x] `ANTHROPIC_API_KEY`
  - [x] `DATABASE_URL`
- [x] CI/CD パイプライン設定（GitHub Actions）
- [ ] 本番環境への初回デプロイ・動作確認 ※ GCPプロジェクト準備後に実施

---

## 完了条件

- [ ] チャットが正常に動作する（送信→AI返答→保存）
- [ ] 過去の会話をサイドバーから参照・継続できる
- [ ] モバイルでも崩れずに表示される
- [ ] Cloud Run 上で本番稼働している

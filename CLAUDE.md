# AI Chat - 社内AIチャットボット

## プロジェクト概要

社内従業員向けの汎用AIアシスタントWebアプリケーション。
ChatGPTよりスタイリッシュなUIを持ち、会話履歴を管理できる社内ツール。

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フロントエンド | Next.js (App Router) |
| バックエンド API | Hono |
| ORM | Prisma (MongoDB adapter) |
| AIエージェント | Mastra |
| AIモデル | Claude claude-sonnet-4-6 (Anthropic) |
| データベース | MongoDB |
| デプロイ | GCP Cloud Run |

## アーキテクチャ

```
ai-chat/
├── app/                        # Next.js App Router
│   ├── (chat)/
│   │   ├── page.tsx            # メインチャット画面
│   │   └── [conversationId]/
│   │       └── page.tsx        # 会話履歴参照画面
│   ├── api/
│   │   └── [[...route]]/
│   │       └── route.ts        # Hono ルートハンドラ (catch-all)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── chat/
│   │   ├── ChatWindow.tsx      # メインチャットエリア
│   │   ├── MessageList.tsx     # メッセージ一覧
│   │   ├── MessageBubble.tsx   # メッセージバブル（マークダウンレンダリング）
│   │   └── ChatInput.tsx       # 入力フォーム
│   └── sidebar/
│       ├── Sidebar.tsx         # サイドバー全体
│       └── ConversationList.tsx # 会話履歴一覧
├── server/
│   ├── index.ts                # Hono アプリケーション定義
│   ├── routes/
│   │   ├── conversations.ts    # 会話CRUD
│   │   └── messages.ts         # メッセージ送受信
│   └── middleware/
│       └── cors.ts
├── mastra/
│   ├── index.ts                # Mastra インスタンス
│   └── agents/
│       └── assistant.ts        # 汎用アシスタントエージェント定義
├── prisma/
│   └── schema.prisma           # MongoDB スキーマ定義
├── lib/
│   ├── prisma.ts               # Prisma クライアントシングルトン
│   └── mastra.ts               # Mastra クライアントシングルトン
└── types/
    └── index.ts                # 共通型定義
```

## 主要機能

### チャット機能
- ユーザーがメッセージを送信するとMastraエージェント経由でClaudeが応答する
- レスポンスはストリーミングなし（完成後に一括表示）
- Claudeの返答はマークダウンレンダリング（コードのシンタックスハイライト含む）

### 会話履歴管理
- 会話（Conversation）ごとにMongoDBへ保存
- サイドバーに過去の会話一覧を表示
- 過去の会話を選択して参照・継続が可能
- 新規会話の開始ボタンを配置

### UI/UX
- レスポンシブデザイン（モバイル・タブレット・デスクトップ対応）
- ChatGPTよりスタイリッシュなデザイン（モダン・洗練されたUI）
- サイドバーに会話履歴一覧
- ダークモード対応を検討

## データモデル（Prisma / MongoDB）

```prisma
model Conversation {
  id        String    @id @default(auto()) @map("_id") @db.ObjectId
  title     String    // 最初のメッセージから自動生成
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  messages  Message[]
}

model Message {
  id             String       @id @default(auto()) @map("_id") @db.ObjectId
  conversationId String       @db.ObjectId
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  role           String       // "user" | "assistant"
  content        String
  createdAt      DateTime     @default(now())
}
```

## API設計（Hono）

| メソッド | エンドポイント | 説明 |
|---|---|---|
| GET | /api/conversations | 会話一覧取得 |
| POST | /api/conversations | 新規会話作成 |
| DELETE | /api/conversations/:id | 会話削除 |
| GET | /api/conversations/:id/messages | 指定会話のメッセージ一覧取得 |
| POST | /api/conversations/:id/messages | メッセージ送信・AI返答取得 |

## Mastraエージェント設定

```typescript
// mastra/agents/assistant.ts
{
  name: "社内アシスタント",
  model: "anthropic/claude-sonnet-4-6",
  instructions: "あなたは社内従業員を支援する汎用AIアシスタントです。質問に対して丁寧かつ正確に回答してください。",
}
```

## 環境変数

```env
# Anthropic
ANTHROPIC_API_KEY=

# MongoDB
DATABASE_URL=mongodb+srv://...

# Next.js
NEXT_PUBLIC_APP_URL=
```

## 開発・デプロイ

### ローカル開発

```bash
npm install
npx prisma generate
npm run dev
```

### Cloud Run デプロイ

- Dockerfileを用意してコンテナビルド
- GCP Cloud Runへデプロイ
- 環境変数はGCP Secret Managerで管理

## コーディング規約

- TypeScript strict mode を使用
- コンポーネントはServer ComponentsとClient Componentsを適切に使い分ける
- `"use client"` は必要最小限のコンポーネントにのみ付与
- Honoのルートは機能ごとにファイルを分割する
- Prismaクライアントはシングルトンパターンで管理する

## テストコード作成時の厳守事項

### テストコードの品質
- テストは必ず実際の機能を検証すること
- `expect(true).toBe(true)` のような意味のないアサーションは書かないこと
- 各テストケースは具体的な入力と期待される出力を検証すること
- モックは必要最小限にとどめ、実際の動作に近い形でテストすること

### ハードコーディングの禁止
- テストを通すためだけのハードコードは禁止
- 本番コードに `if(testMode)` のような条件分岐を入れないこと
- テスト用の特別な値（マジックナンバー）を本番コードに埋め込まないこと

### テスト実装の原則
- テストが失敗する状態から開始すること（Red-Green-Refactor）
- 境界値、異常系、エラーケースも必ずテストすること
- カバレッジだけでなく、実際の品質を重視すること

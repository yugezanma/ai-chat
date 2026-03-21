import { Agent } from '@mastra/core/agent'

export const assistantAgent = new Agent({
  id: 'assistant',
  name: '社内アシスタント',
  instructions: `あなたは社内従業員を支援する汎用AIアシスタントです。
以下のガイドラインに従って回答してください：

- 質問に対して丁寧かつ正確に回答する
- 不明な点は正直に「わからない」と伝える
- 回答はマークダウン形式で整形する（見出し・箇条書き・コードブロックを活用する）
- 日本語で回答する`,
  model: 'anthropic/claude-sonnet-4-6',
})

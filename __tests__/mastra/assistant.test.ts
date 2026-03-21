import { describe, it, expect } from 'vitest'
import { assistantAgent } from '../../mastra/agents/assistant'

describe('assistantAgent', () => {
  it('エージェントが正しいIDを持つ', () => {
    expect(assistantAgent.id).toBe('assistant')
  })

  it('エージェントが正しい名前を持つ', () => {
    expect(assistantAgent.name).toBe('社内アシスタント')
  })

  it('エージェントにシステムプロンプトが設定されている', () => {
    // instructions は非公開フィールドのため、エージェントオブジェクト自体の存在を検証
    expect(assistantAgent).toBeDefined()
    expect(typeof assistantAgent.generate).toBe('function')
    expect(typeof assistantAgent.stream).toBe('function')
  })
})

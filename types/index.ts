export type Conversation = {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

export type Message = {
  id: string
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export type SendMessageResponse = {
  userMessage: Message
  assistantMessage: Message
}

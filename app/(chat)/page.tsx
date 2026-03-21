import MessageList from '@/components/chat/MessageList'
import ChatInput from '@/components/chat/ChatInput'
import NewChatRedirect from './NewChatRedirect'

export default function HomePage() {
  return (
    <div className="flex flex-col h-full">
      <MessageList messages={[]} />
      <NewChatRedirect />
    </div>
  )
}

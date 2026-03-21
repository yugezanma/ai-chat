export default function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      {/* アバター */}
      <div
        className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
        style={{
          background: 'var(--bg-tertiary)',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border)',
        }}
      >
        AI
      </div>

      {/* バブル */}
      <div
        className="px-4 py-3 rounded-2xl flex items-center gap-1.5"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderTopLeftRadius: '4px',
          minWidth: '56px',
        }}
      >
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  )
}

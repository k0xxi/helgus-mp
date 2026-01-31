import type { Conversation } from '@/types/marketplace'

interface ConversationListProps {
  conversations: Conversation[]
  currentUserId: string
  onConversationClick: (conversation: Conversation) => void
}

function formatDate(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'Gerade eben'
  if (diffMins < 60) return `vor ${diffMins}m`
  if (diffHours < 24) return `vor ${diffHours}h`
  if (diffDays < 7) return `vor ${diffDays}d`

  return date.toLocaleDateString('de-AT', { month: 'short', day: 'numeric' })
}

function truncateMessage(message: string, maxLength: number = 60): string {
  if (message.length <= maxLength) return message
  return message.slice(0, maxLength) + '...'
}

export function ConversationList({
  conversations,
  currentUserId,
  onConversationClick,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
        <svg className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">Noch keine Nachrichten</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Sie haben noch keine Unterhaltungen mit anderen Nutzern.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        // Determine the other party in this conversation
        const isCurrentUserBuyer = conversation.buyerId === currentUserId
        const otherParty = isCurrentUserBuyer ? conversation.seller : conversation.buyer
        const lastMessage = conversation.lastMessage
        const unreadCount = conversation.unreadCount || 0

        return (
          <div key={conversation.id} className="flex gap-2 items-stretch group">
            <button
              onClick={() => onConversationClick(conversation)}
              className="flex-1 text-left rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-4 cursor-pointer"
            >
              {/* Product Image Placeholder */}
              <div className="flex-shrink-0 w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden flex items-center justify-center">
                {conversation.product?.images && conversation.product.images.length > 0 ? (
                  <img
                    src={conversation.product.images[0].url}
                    alt={conversation.product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>

              {/* Conversation Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                    {conversation.product?.title || 'Unbekanntes Produkt'}
                  </h3>
                  <div className="flex-shrink-0 flex flex-col items-end gap-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {lastMessage ? formatDate(lastMessage.createdAt) : 'Neu'}
                    </span>
                    {unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium text-white bg-red-600 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Other Party Name */}
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  {otherParty?.name || 'Unbekannter Nutzer'}
                </p>

                {/* Last Message Preview */}
                {lastMessage ? (
                  <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                    <span className={lastMessage.senderId === currentUserId ? 'text-slate-500 dark:text-slate-500' : ''}>
                      {lastMessage.senderId === currentUserId ? 'Du: ' : ''}
                    </span>
                    {truncateMessage(lastMessage.content)}
                  </p>
                ) : (
                  <p className="text-sm text-slate-400 dark:text-slate-500 italic">Keine Nachrichten</p>
                )}
              </div>
            </button>
          </div>
        )
      })}
    </div>
  )
}

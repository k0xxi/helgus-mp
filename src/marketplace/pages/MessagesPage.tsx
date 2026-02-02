import { useEffect, useState } from 'react'
import { MessageCircle, Search, X, ChevronDown, MessageSquare, Package } from 'lucide-react'
import { useAuth } from '@/marketplace/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useConversationsQuery, useConversationsSubscription } from '@/marketplace/hooks'
import type { Conversation } from '@/types/marketplace'

interface GroupedConversations {
  [productId: string]: {
    product: {
      id: string
      title: string
    }
    conversations: Conversation[]
  }
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

export function MessagesPage() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set())
  const { data: conversations = [], isLoading: conversationsLoading, error: conversationsError } = useConversationsQuery(user?.id)

  // Subscribe to real-time conversation updates
  useConversationsSubscription(user?.id)

  // Group conversations by product
  const groupedConversations: GroupedConversations = conversations.reduce((acc, conv) => {
    if (!conv.product?.id) return acc

    const productId = conv.product.id
    if (!acc[productId]) {
      acc[productId] = {
        product: {
          id: conv.product.id,
          title: conv.product.title,
        },
        conversations: [],
      }
    }
    acc[productId].conversations.push(conv)
    return acc
  }, {} as GroupedConversations)

  // Filter products and conversations based on search query
  const filteredProducts = Object.entries(groupedConversations)
    .map(([productId, data]) => ({
      productId,
      ...data,
      conversations: data.conversations.filter((conv) => {
        const searchLower = searchQuery.toLowerCase()
        const otherPartyName = (conv.buyer?.name || conv.seller?.name || '').toLowerCase()
        const lastMessage = conv.lastMessage?.content?.toLowerCase() || ''

        return (
          otherPartyName.includes(searchLower) ||
          lastMessage.includes(searchLower)
        )
      }),
    }))
    .filter((product) => {
      const searchLower = searchQuery.toLowerCase()
      return (
        product.product.title.toLowerCase().includes(searchLower) ||
        product.conversations.length > 0
      )
    })

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/marketplace/auth')
    }
  }, [user, authLoading, navigate])

  const toggleProductExpanded = (productId: string) => {
    setExpandedProducts((prev) => {
      const next = new Set(prev)
      if (next.has(productId)) {
        next.delete(productId)
      } else {
        next.add(productId)
      }
      return next
    })
  }

  const handleConversationClick = (conversation: Conversation) => {
    // Navigate to product page with openChat parameter
    navigate({
      pathname: `/marketplace/product/${conversation.productId}`,
      search: `?openChat=true&conversationId=${conversation.id}`,
    })
  }

  // Show loading state while auth is being resolved
  if (authLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Nachrichten</h1>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-400">Wird geladen...</p>
        </div>
      </div>
    )
  }

  // Only render if user is authenticated
  if (!user) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageCircle className="h-6 w-6 text-blue-500" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Nachrichten</h1>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Nach Produkt, Person oder Nachricht suchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {conversationsLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-400">Wird geladen...</p>
        </div>
      ) : conversationsError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 p-12 text-center">
          <p className="text-sm text-red-600 dark:text-red-400">
            Fehler beim Laden der Nachrichten. Bitte versuchen Sie es später erneut.
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {searchQuery ? 'Keine Nachrichten gefunden' : 'Noch keine Nachrichten'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProducts.map(({ productId, product, conversations: productConversations }) => {
            const isExpanded = expandedProducts.has(productId)
            const totalUnread = productConversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0)

            return (
              <div key={productId} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                {/* Product Header - Always Visible */}
                <button
                  onClick={() => toggleProductExpanded(productId)}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Package className="h-5 w-5 flex-shrink-0 text-slate-400" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                        {product.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {productConversations.length} {productConversations.length === 1 ? 'Nachricht' : 'Nachrichten'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {totalUnread > 0 && (
                      <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium text-white bg-red-600 rounded-full">
                        {totalUnread}
                      </span>
                    )}
                    <ChevronDown
                      className={`h-5 w-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                {/* Conversations List - Visible when Expanded */}
                {isExpanded && (
                  <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
                    {productConversations.length === 0 ? (
                      <div className="px-4 py-3 text-center text-sm text-slate-500 dark:text-slate-400">
                        Keine Nachrichten mit dieser Suchanfrage
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {productConversations.map((conversation) => {
                          const isCurrentUserBuyer = conversation.buyerId === user.id
                          const otherParty = isCurrentUserBuyer ? conversation.seller : conversation.buyer
                          const lastMessage = conversation.lastMessage
                          const unreadCount = conversation.unreadCount || 0

                          return (
                            <button
                              key={conversation.id}
                              onClick={() => handleConversationClick(conversation)}
                              className="w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-3 border-b border-slate-200 dark:border-slate-700 last:border-b-0"
                            >
                              <MessageSquare className="h-4 w-4 flex-shrink-0 text-slate-400" />

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                    {otherParty?.name || 'Unbekannter Nutzer'}
                                  </p>
                                  <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0 whitespace-nowrap">
                                    {lastMessage ? formatDate(lastMessage.createdAt) : 'Neu'}
                                  </span>
                                </div>
                                {lastMessage ? (
                                  <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                                    <span className={lastMessage.senderId === user.id ? 'text-slate-500 dark:text-slate-500' : ''}>
                                      {lastMessage.senderId === user.id ? 'Du: ' : ''}
                                    </span>
                                    {truncateMessage(lastMessage.content)}
                                  </p>
                                ) : (
                                  <p className="text-sm text-slate-400 dark:text-slate-500 italic">Keine Nachrichten</p>
                                )}
                              </div>

                              {unreadCount > 0 && (
                                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium text-white bg-red-600 rounded-full flex-shrink-0">
                                  {unreadCount}
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

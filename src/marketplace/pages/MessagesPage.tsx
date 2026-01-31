import { useEffect, useState } from 'react'
import { MessageCircle, Search, X } from 'lucide-react'
import { useAuth } from '@/marketplace/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useConversationsQuery, useConversationsSubscription } from '@/marketplace/hooks'
import { ConversationList } from '@/marketplace/components/ConversationList'
import type { Conversation } from '@/types/marketplace'

export function MessagesPage() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const { data: conversations = [], isLoading: conversationsLoading, error: conversationsError } = useConversationsQuery(user?.id)

  // Subscribe to real-time conversation updates
  useConversationsSubscription(user?.id)

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conv) => {
    const searchLower = searchQuery.toLowerCase()
    const productTitle = conv.product?.title?.toLowerCase() || ''
    const otherPartyName = (conv.buyer?.name || conv.seller?.name || '').toLowerCase()
    const lastMessage = conv.lastMessage?.content?.toLowerCase() || ''

    return (
      productTitle.includes(searchLower) ||
      otherPartyName.includes(searchLower) ||
      lastMessage.includes(searchLower)
    )
  })

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/marketplace/auth')
    }
  }, [user, authLoading, navigate])

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

  const handleConversationClick = (conversation: Conversation) => {
    // Navigate to product page with openChat parameter
    navigate({
      pathname: `/marketplace/product/${conversation.productId}`,
      search: `?openChat=true&conversationId=${conversation.id}`,
    })
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
      ) : filteredConversations.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {searchQuery ? 'Keine Nachrichten gefunden' : 'Noch keine Nachrichten'}
          </p>
        </div>
      ) : (
        <ConversationList
          conversations={filteredConversations}
          currentUserId={user.id}
          onConversationClick={handleConversationClick}
        />
      )}
    </div>
  )
}

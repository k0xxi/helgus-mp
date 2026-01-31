import { useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import { useAuth } from '@/marketplace/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useConversations } from '@/marketplace/hooks'
import { ConversationList } from '@/marketplace/components/ConversationList'
import type { Conversation } from '@/types/marketplace'

export function MessagesPage() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const { conversations, loading: conversationsLoading } = useConversations(user?.id)

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
    navigate(`/marketplace/product/${conversation.productId}?openChat=true&conversationId=${conversation.id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageCircle className="h-6 w-6 text-blue-500" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Nachrichten</h1>
      </div>

      {conversationsLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-400">Wird geladen...</p>
        </div>
      ) : (
        <ConversationList
          conversations={conversations}
          currentUserId={user.id}
          onConversationClick={handleConversationClick}
        />
      )}
    </div>
  )
}

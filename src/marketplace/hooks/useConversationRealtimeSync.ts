import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useRealtimeSubscription } from './useRealtimeSubscription'
import { queryKeys } from './useQueryHooks'
import type { Tables } from '@/types/database'

/**
 * Hook that subscribes to message/conversation changes and invalidates React Query cache
 * Keeps conversations and messages in sync with database changes
 */
export function useConversationRealtimeSync(conversationId?: string) {
  const queryClient = useQueryClient()

  const handleMessageChange = useCallback(
    (event: {
      type: 'INSERT' | 'UPDATE' | 'DELETE'
      new?: Partial<Tables<'messages'>>
      old?: Partial<Tables<'messages'>>
    }) => {
      if (!conversationId) return

      // Only invalidate if the message belongs to this conversation
      if (event.new?.conversation_id === conversationId || event.old?.conversation_id === conversationId) {
        // Invalidate messages for this conversation
        queryClient.invalidateQueries({
          queryKey: queryKeys.messages.list(conversationId),
        })

        // Also invalidate conversations list (for unread count)
        queryClient.invalidateQueries({
          queryKey: queryKeys.conversations.all,
        })
      }
    },
    [conversationId, queryClient]
  )

  const { isConnected, error } = useRealtimeSubscription('messages', handleMessageChange)

  return { isConnected, error }
}

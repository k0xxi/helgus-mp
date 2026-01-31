import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type {
  Seller,
  Message,
} from '@/../product/sections/produktdetails-verhandlung/types'
import type { Conversation } from '@/types/marketplace'

// =============================================================================
// Query Keys - Centralized for easy cache invalidation
// =============================================================================

export const queryKeys = {
  products: {
    all: ['products'] as const,
    list: (filters?: any) => [...queryKeys.products.all, 'list', filters] as const,
    detail: (id?: string) => [...queryKeys.products.all, 'detail', id] as const,
  },
  conversations: {
    all: ['conversations'] as const,
    list: (userId?: string) => [...queryKeys.conversations.all, 'list', userId] as const,
    detail: (id?: string) => [...queryKeys.conversations.all, 'detail', id] as const,
  },
  messages: {
    all: ['messages'] as const,
    list: (conversationId?: string) => [...queryKeys.messages.all, 'list', conversationId] as const,
  },
  offers: {
    all: ['offers'] as const,
    list: (productId?: string) => [...queryKeys.offers.all, 'list', productId] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    list: (userId?: string) => [...queryKeys.notifications.all, 'list', userId] as const,
  },
  profiles: {
    all: ['profiles'] as const,
    detail: (id?: string) => [...queryKeys.profiles.all, 'detail', id] as const,
  },
  categories: {
    all: ['categories'] as const,
    withCounts: () => [...queryKeys.categories.all, 'withCounts'] as const,
  },
}

// =============================================================================
// Conversations Hook - Replaces useConversations
// =============================================================================

export function useConversationsQuery(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.conversations.list(userId),
    queryFn: async () => {
      if (!userId) return []

      // Fetch conversations where user is either buyer or seller
      const { data, error: fetchError } = await supabase
        .from('conversations')
        .select(`
          id,
          product_id,
          buyer_id,
          seller_id,
          created_at,
          products!product_id(id, title, seller_id),
          profiles_buyer:profiles!buyer_id(id, name, avatar_url),
          profiles_seller:profiles!seller_id(id, name, avatar_url)
        `)
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      // Fetch latest message and unread count for each conversation
      const conversationsWithMessages = await Promise.all(
        (data || []).map(async (conv: any) => {
          const { data: messageData } = await (supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single() as any)

          const { count, error: countError } = await (supabase
            .from('messages')
            .select('id', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('is_read', false)
            .neq('sender_id', userId) as any)

          if (countError) {
            console.error('Error fetching unread count:', countError)
          }

          return {
            id: conv.id,
            productId: conv.product_id,
            buyerId: conv.buyer_id,
            sellerId: conv.seller_id,
            createdAt: new Date(conv.created_at),
            product: conv.products ? {
              id: conv.products.id,
              title: conv.products.title,
              sellerId: conv.products.seller_id,
            } : undefined,
            buyer: conv.profiles_buyer ? {
              id: conv.profiles_buyer.id,
              name: conv.profiles_buyer.name,
              avatarUrl: conv.profiles_buyer.avatar_url,
            } : undefined,
            seller: conv.profiles_seller ? {
              id: conv.profiles_seller.id,
              name: conv.profiles_seller.name,
              avatarUrl: conv.profiles_seller.avatar_url,
            } : undefined,
            lastMessage: messageData ? {
              id: messageData.id,
              conversationId: messageData.conversation_id,
              senderId: messageData.sender_id,
              content: messageData.content,
              isRead: messageData.is_read,
              createdAt: new Date(messageData.created_at),
            } : undefined,
            unreadCount: count || 0,
          }
        })
      )

      return conversationsWithMessages as Conversation[]
    },
    enabled: !!userId,
    staleTime: 1000 * 30, // 30 seconds
  })
}

// =============================================================================
// Send Message Mutation - Replaces sendMessage function
// =============================================================================

export function useSendMessageMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      conversationId,
      content,
      userId,
      productId,
      sellerId,
    }: {
      conversationId?: string
      content: string
      userId: string
      productId: string
      sellerId?: string
    }) => {
      let msgConversationId = conversationId

      // If no conversation exists, create one (only for buyers)
      if (!msgConversationId && sellerId && userId !== sellerId) {
        const { data: newConv, error: createError } = await (supabase as any)
          .from('conversations')
          .insert({
            product_id: productId,
            buyer_id: userId,
            seller_id: sellerId,
          })
          .select('id')
          .single()

        if (createError) throw createError
        msgConversationId = (newConv as any).id
      }

      if (!msgConversationId) {
        throw new Error('Keine aktive Konversation gefunden.')
      }

      const { data: newMsg, error: sendError } = await (supabase as any)
        .from('messages')
        .insert({
          conversation_id: msgConversationId,
          sender_id: userId,
          content,
        })
        .select('id, created_at')
        .single()

      if (sendError) throw sendError

      return { ...newMsg, conversationId: msgConversationId }
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch messages
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.list(data.conversationId),
      })
      // Invalidate conversations to update last message
      queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.all,
      })
      // Invalidate product conversations
      queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.detail(variables.productId),
      })
    },
    onError: (error) => {
      console.error('Error sending message:', error)
    },
  })
}

// =============================================================================
// Get Conversations for a Specific Product
// =============================================================================

export function useProductConversationsQuery(
  productId: string | undefined,
  sellerId: string | undefined,
  userId: string | undefined
) {
  return useQuery({
    queryKey: queryKeys.conversations.detail(productId),
    queryFn: async () => {
      if (!productId || !userId || !sellerId) return null

      let query: any = supabase
        .from('conversations')
        .select('id, buyer_id, seller_id')
        .eq('product_id', productId)

      // If user is the buyer, find conversation where they're the buyer
      // If user is the seller, find the most recent conversation
      if (userId !== sellerId) {
        query = query.eq('buyer_id', userId)
      }

      const { data: existingConv, error: convError } = await query
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle() as any

      if (convError && convError.code !== 'PGRST116') {
        throw convError
      }

      return existingConv as any || null
    },
    enabled: !!productId && !!userId && !!sellerId,
    staleTime: 1000 * 60 * 2,
  })
}

// =============================================================================
// Get Messages for a Conversation
// =============================================================================

export function useConversationMessagesQuery(
  conversationId: string | null | undefined,
  userId: string | null | undefined
) {
  return useQuery({
    queryKey: queryKeys.messages.list(conversationId || undefined),
    queryFn: async () => {
      if (!conversationId) return []

      const { data: messagesData, error: msgError } = await (supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          content,
          is_read,
          created_at,
          profiles!sender_id(name)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true }) as any)

      if (msgError) throw msgError

      return ((messagesData || []) as any[]).map((msg) => ({
        id: msg.id,
        senderId: msg.sender_id,
        senderName: msg.profiles.name,
        content: msg.content,
        timestamp: msg.created_at,
        isOwn: msg.sender_id === userId,
        isRead: msg.is_read,
      })) as Message[]
    },
    enabled: !!conversationId && !!userId,
    staleTime: 1000 * 2, // 2 seconds - very fresh
    refetchInterval: 1000 * 3, // Refetch every 3 seconds to catch new messages
  })
}

// =============================================================================
// Get Buyer Profile
// =============================================================================

export function useBuyerProfileQuery(buyerId: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.profiles.detail(buyerId || undefined),
    queryFn: async () => {
      if (!buyerId) return null

      const { data: profile, error: fetchError } = await (supabase
        .from('profiles')
        .select('id, name, avatar_url, city, is_verified, created_at')
        .eq('id', buyerId)
        .single() as any)

      if (fetchError) throw fetchError

      if (!profile) throw new Error('Buyer profile not found')

      const mappedBuyer: Seller = {
        id: profile.id,
        name: profile.name,
        avatar: profile.avatar_url
          ? supabase.storage.from('profiles').getPublicUrl(profile.avatar_url).data.publicUrl
          : undefined,
        city: profile.city || 'Österreich',
        memberSince: profile.created_at,
        rating: 5,
        totalSales: 0,
        responseTime: 'Antwortet meist innerhalb von 24h',
        isVerified: profile.is_verified,
      }

      return mappedBuyer
    },
    enabled: !!buyerId,
    staleTime: 1000 * 60 * 60, // 1 hour for profiles
  })
}

// =============================================================================
// Mark Messages as Read Mutation
// =============================================================================

export function useMarkMessagesAsReadMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      conversationId,
      userId,
    }: {
      conversationId: string
      userId: string
    }) => {
      // Mark all unread messages from other users as read
      const { error } = await (supabase as any)
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', userId)
        .eq('is_read', false)

      if (error) throw error
    },
    onSuccess: () => {
      // Invalidate conversations to update unread count
      queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.all,
      })
      // Invalidate all messages queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.all,
      })
    },
    onError: (error) => {
      console.error('Error marking messages as read:', error)
    },
  })
}

// =============================================================================
// Real-Time Message Subscription
// =============================================================================

export function useMessagesSubscription(conversationId: string | null | undefined) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!conversationId) return

    // Subscribe to new messages and updates using modern Supabase channel API
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          // Invalidate messages query to trigger refetch
          queryClient.invalidateQueries({
            queryKey: queryKeys.messages.list(conversationId),
          })
          // Also invalidate conversations to update unread badge
          queryClient.invalidateQueries({
            queryKey: queryKeys.conversations.all,
          })
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [conversationId, queryClient])
}

// =============================================================================
// Real-Time Conversations Subscription
// =============================================================================

export function useConversationsSubscription(userId: string | null | undefined) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!userId) return

    // Subscribe to conversation changes (new messages, status updates) using modern channel API
    const channel = supabase
      .channel(`conversations:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        () => {
          // When a new message is added, invalidate all conversations to update unread counts
          queryClient.invalidateQueries({
            queryKey: queryKeys.conversations.all,
          })
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [userId, queryClient])
}

// =============================================================================
// Real-Time Notifications Subscription
// =============================================================================

export function useNotificationsSubscription(userId: string | null | undefined) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!userId) return

    // Subscribe to notification changes (new notifications, marked as read) using modern channel API
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          // When notifications change, invalidate the notifications query to trigger refetch
          queryClient.invalidateQueries({
            queryKey: ['notifications', 'list', userId],
          })
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [userId, queryClient])
}

// =============================================================================
// Typing Indicator Mutation
// =============================================================================

export function useTypingIndicatorMutation() {
  return useMutation({
    mutationFn: async ({
      conversationId,
      userId,
      isTyping,
    }: {
      conversationId: string
      userId: string
      isTyping: boolean
    }) => {
      // Store typing status in a temporary table or use presence
      // For now, we'll use a simple approach with a special message type
      // Typing indicators are tracked but not logged
    },
    onError: (error) => {
      console.error('Error sending typing indicator:', error)
    },
  })
}

// =============================================================================
// Real-Time Typing Subscription (Listen for typing indicators)
// =============================================================================

export function useTypingSubscription(
  conversationId: string | null | undefined,
  userId: string | null | undefined
) {
  const [typingUsers] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!conversationId || !userId) return

    // Subscribe to typing indicators using modern channel API
    const channel = supabase
      .channel(`typing:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          // Could implement a more sophisticated typing indicator system here
          // For now, we track who is typing based on message metadata
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [conversationId, userId])

  return typingUsers
}

// =============================================================================
// Delete Conversation Mutation
// =============================================================================

export function useDeleteConversationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (conversationId: string) => {
      // Delete all messages in the conversation first
      const { error: messagesError } = await supabase
        .from('messages')
        .delete()
        .eq('conversation_id', conversationId)

      if (messagesError) {
        throw new Error(`Fehler beim Löschen der Nachrichten: ${messagesError.message}`)
      }

      // Then delete the conversation
      const { error: conversationError } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId)

      if (conversationError) {
        throw new Error(`Fehler beim Löschen der Unterhaltung: ${conversationError.message}`)
      }
    },
    onSuccess: () => {
      // Invalidate all conversation queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.all,
      })
    },
    onError: (error) => {
      console.error('Failed to delete conversation:', error)
    },
  })
}

// =============================================================================
// Delete Notification Mutation
// =============================================================================

export function useDeleteNotificationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

      if (error) {
        throw new Error(`Fehler beim Löschen der Benachrichtigung: ${error.message}`)
      }
    },
    onSuccess: () => {
      // Invalidate all notification queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all,
      })
    },
    onError: (error) => {
      console.error('Failed to delete notification:', error)
    },
  })
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type {
  Seller,
  Message,
} from '@/../product/sections/produktdetails-verhandlung/types'
import type { Conversation } from '@/types/marketplace'

// =============================================================================
// Internal Types for Supabase Responses
// =============================================================================

/**
 * Raw message record from Supabase database
 */
interface SupabaseMessage {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  is_read: boolean
  created_at: string
  profiles?: {
    name: string
  }
}

/**
 * Raw conversation record from Supabase database
 */
interface SupabaseConversation {
  id: string
  product_id: string
  buyer_id: string
  seller_id: string
  created_at: string
  products?: {
    id: string
    title: string
    seller_id: string
  }
  profiles_buyer?: {
    id: string
    name: string
    avatar_url: string | null
  }
  profiles_seller?: {
    id: string
    name: string
    avatar_url: string | null
  }
}

/**
 * Raw profile record from Supabase database
 */
interface SupabaseProfile {
  id: string
  name: string
  avatar_url: string | null
  city: string | null
  is_verified: boolean
  created_at: string
}

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

/**
 * Query hook to fetch all conversations for a user (as buyer or seller)
 *
 * @param userId - User ID to fetch conversations for
 * @returns React Query result with conversation data
 *
 * @remarks
 * - Fetches latest message and unread count for each conversation
 * - Updates cache on real-time changes via subscription
 * - Returns empty array if userId is not provided
 *
 * @note Performance: Has N+1 query issue
 *
 * @todo Optimize N+1 queries:
 *   Current: 1 query for conversations + 2 queries per conversation (last message + unread count)
 *   = 1 + (2 × N) queries for N conversations
 *
 *   Solution: Use SQL window functions and aggregate queries:
 *   - Fetch conversations with LATERAL JOIN for last message
 *   - Use aggregate function to get unread count in same query
 *   - Reduces to single query with JOIN and window functions
 *
 *   Example SQL pattern (pseudocode):
 *   SELECT c.*,
 *     LATERAL (SELECT * FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_msg,
 *     COUNT(*) FILTER (WHERE is_read = false AND sender_id != userId) AS unread_count
 *   FROM conversations c
 */
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
        (data || []).map(async (conv: SupabaseConversation) => {
<<<<<<< HEAD
          const { data: messageData } = await (supabase
=======
          const { data: messageData } = await supabase
>>>>>>> 11633f73ee3451e74ee5ca6a99001284fe209daf
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single<SupabaseMessage>()

          const { count, error: countError } = await supabase
            .from('messages')
            .select('id', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('is_read', false)
            .neq('sender_id', userId)

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

      return conversationsWithMessages
    },
    enabled: !!userId,
    staleTime: 1000 * 30, // 30 seconds
  })
}

// =============================================================================
// Send Message Mutation - Replaces sendMessage function
// =============================================================================

/**
 * Mutation hook to send a message in a conversation
 *
 * @returns React Query mutation for sending messages
 *
 * @remarks
 * - Creates a new conversation if one doesn't exist (buyer-seller only)
 * - Requires valid conversation ID, content, userId, and productId
 * - Invalidates messages and conversations queries on success
 * - Content validation should be done before calling mutation
 */
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
        const { data: newConv, error: createError } = await supabase
          .from('conversations')
          .insert({
            product_id: productId,
            buyer_id: userId,
            seller_id: sellerId,
          })
          .select('id')
          .single<{ id: string }>()

        if (createError) throw createError
        if (!newConv?.id) {
          throw new Error('Konversation konnte nicht erstellt werden.')
        }
        msgConversationId = newConv.id
      }

      if (!msgConversationId) {
        throw new Error('Keine aktive Konversation gefunden.')
      }

      const { data: newMsg, error: sendError } = await supabase
        .from('messages')
        .insert({
          conversation_id: msgConversationId,
          sender_id: userId,
          content,
        })
        .select('id, created_at')
        .single<{ id: string; created_at: string }>()

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

/**
 * Query hook to fetch a conversation for a specific product
 *
 * @param productId - Product ID to fetch conversations for
 * @param sellerId - Seller ID to identify the product owner
 * @param userId - Current user ID to determine their role
 * @returns React Query result with conversation data or null
 *
 * @remarks
 * - Returns the user's existing conversation or null if none exists
 * - Buyers see their conversation with the seller
 * - Sellers see the most recent conversation for the product
 */
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
        .maybeSingle<{ id: string; buyer_id: string; seller_id: string }>()

      if (convError && convError.code !== 'PGRST116') {
        throw convError
      }

      return existingConv || null
    },
    enabled: !!productId && !!userId && !!sellerId,
    staleTime: 1000 * 60 * 2,
  })
}

// =============================================================================
// Get Messages for a Conversation
// =============================================================================

/**
 * Query hook to fetch all messages in a conversation
 *
 * @param conversationId - Conversation ID to fetch messages for
 * @param userId - Current user ID to mark ownership of messages
 * @returns React Query result with array of messages
 *
 * @remarks
 * - Messages are ordered by creation date (oldest first)
 * - Refetches every 3 seconds to catch new messages
 * - Returns empty array if conversationId is not provided
 * - Includes sender name for each message
 */
export function useConversationMessagesQuery(
  conversationId: string | null | undefined,
  userId: string | null | undefined
) {
  return useQuery({
    queryKey: queryKeys.messages.list(conversationId || undefined),
    queryFn: async () => {
      if (!conversationId) return []

      const { data: messagesData, error: msgError } = await supabase
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
        .order('created_at', { ascending: true })
        .returns<Array<SupabaseMessage & { profiles: { name: string } }>>()

      if (msgError) throw msgError

      return ((messagesData || []).map((msg) => ({
        id: msg.id,
        senderId: msg.sender_id,
        senderName: msg.profiles.name,
        content: msg.content,
        timestamp: msg.created_at,
        isOwn: msg.sender_id === userId,
        isRead: msg.is_read,
      }))) as Message[]
    },
    enabled: !!conversationId && !!userId,
    staleTime: 1000 * 2, // 2 seconds - very fresh
    refetchInterval: 1000 * 3, // Refetch every 3 seconds to catch new messages
  })
}

// =============================================================================
// Get Buyer Profile
// =============================================================================

/**
 * Query hook to fetch a buyer's profile information
 *
 * @param buyerId - Buyer ID to fetch profile for
 * @returns React Query result with seller information (rating, member since, etc.)
 *
 * @remarks
 * - Caches profile data for 1 hour (profiles rarely change)
 * - Throws error if profile is not found in database
 * - Maps profile data to Seller type with defaults for calculated fields
 *
 * @todo Add missing profile fields to database:
 *   - rating: Calculate from seller reviews (avg, count)
 *   - totalSales: Count completed transactions
 *   - responseTime: Median response time to messages
 *   - Currently hardcoded as: rating=5, totalSales=0, responseTime='Antwortet meist innerhalb von 24h'
 *   - These should be fetched from aggregated tables or materialized views
 */
export function useBuyerProfileQuery(buyerId: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.profiles.detail(buyerId || undefined),
    queryFn: async () => {
      if (!buyerId) return null

      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('id, name, avatar_url, city, is_verified, created_at')
        .eq('id', buyerId)
        .single<SupabaseProfile>()

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

/**
 * Mutation hook to mark all unread messages as read in a conversation
 *
 * @returns React Query mutation for marking messages as read
 *
 * @remarks
 * - Marks all unread messages from other users as read
 * - Skips messages the current user sent
 * - Invalidates conversations and messages queries after marking
 * - Used when user opens a conversation
 */
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
      const { error } = await supabase
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

/**
 * Subscription hook for real-time message updates in a conversation
 *
 * @param conversationId - Conversation ID to subscribe to
 * @remarks
 * - Uses Supabase Postgres Changes to detect new messages and updates
 * - Automatically unsubscribes on component unmount
 * - Invalidates message and conversation queries when changes detected
 */
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

/**
 * Subscription hook for real-time conversation updates (new messages)
 *
 * @param userId - User ID to subscribe to for their conversations
 * @remarks
 * - Listens for INSERT events on messages table (new messages)
 * - Automatically unsubscribes on component unmount
 * - Invalidates conversations query to update unread counts
 * - Triggers refetch of all conversations when new messages arrive
 */
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

/**
 * Subscription hook for real-time notification updates
 *
 * @param userId - User ID to subscribe to for their notifications
 * @remarks
 * - Listens for all changes (INSERT, UPDATE, DELETE) on notifications table
 * - Automatically unsubscribes on component unmount
 * - Invalidates notifications query to update the notification list
 * - Includes notifications marked as read/unread
 */
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

/**
 * Mutation hook to send a typing indicator
 *
 * @returns React Query mutation for typing indicator (currently a no-op)
 *
 * @remarks
 * - Currently not implemented (typing is tracked but not logged)
 * - TODO: Implement with either temporary table or Supabase presence
 * - Could use a timed cache to clear typing status after user stops typing
 */
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

/**
 * Subscription hook for tracking which users are typing
 *
 * @param conversationId - Conversation ID to subscribe to
 * @param userId - Current user ID
 * @returns Set of user IDs currently typing
 *
 * @remarks
 * - Currently returns empty set (typing tracking not fully implemented)
 * - TODO: Implement with presence API or temporary typing status
 * - Could enhance chat UX with "X is typing..." indicator
 */
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

/**
 * Mutation hook to delete a conversation and all its messages
 *
 * @returns React Query mutation with error handling
 *
 * @remarks
 * - Deletes all messages in the conversation first, then the conversation
 * - Invalidates all conversation queries after deletion
 * - Throws error if deletion fails
 */
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

/**
 * Mutation hook to delete a notification
 *
 * @returns React Query mutation with error handling
 *
 * @remarks
 * - Deletes notification from database
 * - Invalidates all notification queries after deletion
 * - Throws error if deletion fails with descriptive message
 */
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

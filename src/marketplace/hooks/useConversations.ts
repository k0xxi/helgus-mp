import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Conversation } from '@/types/marketplace'

interface UseConversationsResult {
  conversations: Conversation[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

// Type for the joined query result
interface ConversationQueryResult {
  id: string
  product_id: string
  buyer_id: string
  seller_id: string
  created_at: string
  products: {
    id: string
    title: string
    seller_id: string
  } | null
  profiles_buyer: {
    id: string
    name: string
    avatar_url: string | null
  } | null
  profiles_seller: {
    id: string
    name: string
    avatar_url: string | null
  } | null
}

export function useConversations(userId: string | undefined): UseConversationsResult {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchConversations = useCallback(async () => {
    if (!userId) {
      setConversations([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Fetch conversations where user is either buyer or seller
      const { data, error: fetchError } = await supabase
        .from('conversations')
        .select(
          `
          id,
          product_id,
          buyer_id,
          seller_id,
          created_at,
          products!product_id(id, title, seller_id),
          profiles_buyer:profiles!buyer_id(id, name, avatar_url),
          profiles_seller:profiles!seller_id(id, name, avatar_url)
        `
        )
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      // For each conversation, get the latest message to display
      const queryResults = (data || []) as unknown as ConversationQueryResult[]

      const mappedConversations: Conversation[] = await Promise.all(
        queryResults.map(async (conv) => {
          // Get latest message in this conversation
          const { data: messageData } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single() as any

          // Get unread count for current user
          const { data: unreadData, error: unreadError } = await supabase
            .from('messages')
            .select('id', { count: 'exact', head: false })
            .eq('conversation_id', conv.id)
            .eq('is_read', false)
            .neq('sender_id', userId) as any

          return {
            id: conv.id,
            productId: conv.product_id,
            buyerId: conv.buyer_id,
            sellerId: conv.seller_id,
            createdAt: new Date(conv.created_at),
            product: conv.products
              ? {
                  id: conv.products.id,
                  title: conv.products.title,
                  sellerId: conv.products.seller_id,
                  categoryId: '',
                  description: '',
                  price: 0,
                  condition: 'neu' as const,
                  deliveryOptions: [],
                  shippingCost: null,
                  zip: '',
                  city: '',
                  phoneContactAvailable: false,
                  viewCount: 0,
                  isActive: true,
                  soldAt: null,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  images: [],
                }
              : undefined,
            buyer: conv.profiles_buyer
              ? {
                  id: conv.profiles_buyer.id,
                  name: conv.profiles_buyer.name,
                  avatarUrl: conv.profiles_buyer.avatar_url,
                  bio: null,
                  city: null,
                  country: '',
                  isVerified: false,
                  memberSince: new Date(),
                  listingsCount: 0,
                  responseTime: null,
                }
              : undefined,
            seller: conv.profiles_seller
              ? {
                  id: conv.profiles_seller.id,
                  name: conv.profiles_seller.name,
                  avatarUrl: conv.profiles_seller.avatar_url,
                  bio: null,
                  city: null,
                  country: '',
                  isVerified: false,
                  memberSince: new Date(),
                  listingsCount: 0,
                  responseTime: null,
                }
              : undefined,
            lastMessage: messageData
              ? {
                  id: (messageData as any).id,
                  conversationId: (messageData as any).conversation_id,
                  senderId: (messageData as any).sender_id,
                  content: (messageData as any).content,
                  isRead: (messageData as any).is_read,
                  createdAt: new Date((messageData as any).created_at),
                }
              : undefined,
            unreadCount: unreadError ? 0 : (unreadData as any)?.length || 0,
          }
        })
      )

      setConversations(mappedConversations)
    } catch (err) {
      setError(err as Error)
      setConversations([])
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  return { conversations, loading, error, refetch: fetchConversations }
}

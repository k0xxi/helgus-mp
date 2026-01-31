import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Tables } from '@/types/database'
import type {
  Product,
  Seller,
  Category,
  Message,
  Offer,
  Notification,
} from '@/../product/sections/produktdetails-verhandlung/types'

// =============================================================================
// Type for product detail query result
// =============================================================================

interface ProductDetailQueryResult {
  id: string
  seller_id: string
  category_id: string
  title: string
  description: string
  price: number
  condition: string
  delivery_options: string[]
  shipping_cost: number | null
  zip: string
  city: string
  phone_contact_available: boolean
  view_count: number
  is_active: boolean
  sold_at: string | null
  created_at: string
  updated_at: string
  profiles: {
    id: string
    name: string
    avatar_url: string | null
    city: string | null
    is_verified: boolean
    created_at: string
  }
  categories: {
    id: string
    name: string
    slug: string
    parent_id: string | null
  }
  product_images: {
    id: string
    storage_path: string
    sort_order: number
  }[]
}

// =============================================================================
// Condition display mapping
// =============================================================================

const conditionDisplayMap: Record<string, Product['condition']> = {
  'neu': 'Neu',
  'wie-neu': 'Wie neu',
  'sehr-gut': 'Gut',
  'gut': 'Gut',
  'akzeptabel': 'Akzeptabel',
}

// =============================================================================
// Helper: Create notification
// =============================================================================

async function createNotification(params: {
  userId: string
  type: 'new_message' | 'offer_received' | 'offer_accepted' | 'offer_declined' | 'price_drop'
  title: string
  message: string
  productId?: string
}): Promise<void> {
  try {
    await supabase.from('notifications').insert({
      user_id: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      product_id: params.productId || null,
    } as never)
  } catch (err) {
    console.error('Failed to create notification:', err)
  }
}

// =============================================================================
// useProductDetail - Fetch single product with all details
// =============================================================================

interface UseProductDetailResult {
  product: Product | null
  seller: Seller | null
  category: Category | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
  incrementViewCount: () => Promise<void>
}

export function useProductDetail(
  productId: string | undefined,
  userId: string | undefined,
  isFavorited: boolean
): UseProductDetailResult {
  const [product, setProduct] = useState<Product | null>(null)
  const [seller, setSeller] = useState<Seller | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select(`
          *,
          profiles!seller_id(id, name, avatar_url, city, is_verified, created_at),
          categories!category_id(id, name, slug, parent_id),
          product_images(id, storage_path, sort_order)
        `)
        .eq('id', productId)
        .single()

      if (fetchError) {
        throw fetchError
      }

      if (!data) {
        throw new Error('Produkt nicht gefunden')
      }

      const queryResult = data as unknown as ProductDetailQueryResult
      const profile = queryResult.profiles
      const cat = queryResult.categories
      const images = queryResult.product_images || []

      // Sort images by sort_order and build image objects
      const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order)
      const productImages = sortedImages.map((img, idx) => ({
        id: img.id,
        url: supabase.storage.from('products').getPublicUrl(img.storage_path).data.publicUrl,
        alt: `${queryResult.title} - Bild ${idx + 1}`,
      }))

      // Map to Product type
      const mappedProduct: Product = {
        id: queryResult.id,
        title: queryResult.title,
        description: queryResult.description,
        price: Number(queryResult.price),
        condition: conditionDisplayMap[queryResult.condition] || 'Gut',
        images: productImages,
        postalCode: queryResult.zip,
        city: queryResult.city,
        createdAt: queryResult.created_at,
        shippingOptions: {
          pickup: queryResult.delivery_options.includes('abholung'),
          shipping: queryResult.delivery_options.includes('versand'),
          shippingCost: queryResult.shipping_cost ?? undefined,
        },
        isFavorite: isFavorited,
        viewCount: queryResult.view_count,
        sellerId: queryResult.seller_id,
      }

      // Map to Seller type (use placeholder values for rating, sales, responseTime)
      const mappedSeller: Seller = {
        id: profile.id,
        name: profile.name,
        avatar: profile.avatar_url
          ? supabase.storage.from('profiles').getPublicUrl(profile.avatar_url).data.publicUrl
          : undefined,
        city: profile.city || 'Österreich',
        memberSince: profile.created_at,
        rating: 5, // Placeholder
        totalSales: 0, // Placeholder
        responseTime: 'Antwortet meist innerhalb von 24h', // Placeholder
        isVerified: profile.is_verified,
      }

      // Map to Category type
      // For now, use same category for main and sub (no subcategory hierarchy)
      const mappedCategory: Category = {
        main: {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
        },
        sub: {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
        },
      }

      setProduct(mappedProduct)
      setSeller(mappedSeller)
      setCategory(mappedCategory)
    } catch (err) {
      setError(err as Error)
      setProduct(null)
      setSeller(null)
      setCategory(null)
    } finally {
      setLoading(false)
    }
  }, [productId, isFavorited])

  const incrementViewCount = useCallback(async () => {
    if (!productId || !product) return

    try {
      await supabase
        .from('products')
        .update({ view_count: product.viewCount + 1 })
        .eq('id', productId)

      // Update local state
      setProduct(prev => prev ? { ...prev, viewCount: prev.viewCount + 1 } : null)
    } catch (err) {
      console.error('Failed to increment view count:', err)
    }
  }, [productId, product])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  return { product, seller, category, loading, error, refetch: fetchProduct, incrementViewCount }
}

// =============================================================================
// useConversation - Fetch or create conversation and messages
// =============================================================================

interface UseConversationResult {
  conversationId: string | null
  messages: Message[]
  loading: boolean
  error: Error | null
  sendMessage: (content: string) => Promise<{ error: Error | null }>
  refetch: () => Promise<void>
}

export function useConversation(
  productId: string | undefined,
  sellerId: string | undefined,
  userId: string | undefined
): UseConversationResult {
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchConversation = useCallback(async () => {
    if (!productId || !userId || !sellerId) {
      setLoading(false)
      return
    }

    // Don't fetch conversation if user is the seller
    if (userId === sellerId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Try to find existing conversation
      const { data: existingConv, error: convError } = await supabase
        .from('conversations')
        .select('id')
        .eq('product_id', productId)
        .eq('buyer_id', userId)
        .single()

      if (convError && convError.code !== 'PGRST116') {
        // PGRST116 = no rows returned
        throw convError
      }

      let convId = existingConv?.id || null
      setConversationId(convId)

      if (convId) {
        // Fetch messages for this conversation
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
          .eq('conversation_id', convId)
          .order('created_at', { ascending: true })

        if (msgError) {
          throw msgError
        }

        const mappedMessages: Message[] = ((messagesData || []) as unknown as {
          id: string
          sender_id: string
          content: string
          is_read: boolean
          created_at: string
          profiles: { name: string }
        }[]).map((msg) => ({
          id: msg.id,
          senderId: msg.sender_id,
          senderName: msg.profiles.name,
          content: msg.content,
          timestamp: msg.created_at,
          isOwn: msg.sender_id === userId,
          isRead: msg.is_read,
        }))

        setMessages(mappedMessages)
      }
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [productId, sellerId, userId])

  const sendMessage = async (content: string): Promise<{ error: Error | null }> => {
    if (!productId || !userId || !sellerId) {
      return { error: new Error('Bitte melden Sie sich an, um Nachrichten zu senden.') }
    }

    if (userId === sellerId) {
      return { error: new Error('Sie können sich nicht selbst eine Nachricht senden.') }
    }

    try {
      let convId = conversationId

      // Create conversation if it doesn't exist
      if (!convId) {
        const insertData = {
          product_id: productId,
          buyer_id: userId,
          seller_id: sellerId,
        }
        const { data: newConv, error: createError } = await supabase
          .from('conversations')
          .insert(insertData as never)
          .select('id')
          .single()

        if (createError) {
          throw createError
        }

        convId = (newConv as { id: string }).id
        setConversationId(convId)
      }

      // Send the message
      const msgData = {
        conversation_id: convId,
        sender_id: userId,
        content,
      }
      const { data: newMsg, error: sendError } = await supabase
        .from('messages')
        .insert(msgData as never)
        .select('id, created_at')
        .single()

      if (sendError) {
        throw sendError
      }

      // Add to local state optimistically
      const newMessage: Message = {
        id: (newMsg as { id: string }).id,
        senderId: userId,
        senderName: 'Sie',
        content,
        timestamp: (newMsg as { created_at: string }).created_at,
        isOwn: true,
        isRead: false,
      }
      setMessages((prev) => [...prev, newMessage])

      // Create notification for recipient (seller)
      await createNotification({
        userId: sellerId,
        type: 'new_message',
        title: 'Neue Nachricht',
        message: content.length > 50 ? content.substring(0, 50) + '...' : content,
        productId,
      })

      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }

  useEffect(() => {
    fetchConversation()
  }, [fetchConversation])

  return { conversationId, messages, loading, error, sendMessage, refetch: fetchConversation }
}

// =============================================================================
// useOffers - Create and manage offers
// =============================================================================

interface UseOffersResult {
  offers: Offer[]
  loading: boolean
  error: Error | null
  createOffer: (amount: number, message?: string) => Promise<{ error: Error | null }>
  respondToOffer: (offerId: string, status: 'accepted' | 'declined') => Promise<{ error: Error | null }>
  refetch: () => Promise<void>
}

export function useOffers(
  productId: string | undefined,
  originalPrice: number,
  userId: string | undefined,
  sellerId?: string
): UseOffersResult {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchOffers = useCallback(async () => {
    if (!productId || !userId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('offers')
        .select(`
          id,
          product_id,
          buyer_id,
          amount,
          message,
          status,
          responded_at,
          created_at,
          profiles!buyer_id(name)
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      const mappedOffers: Offer[] = ((data || []) as unknown as {
        id: string
        product_id: string
        buyer_id: string
        amount: number
        message: string | null
        status: 'pending' | 'accepted' | 'declined'
        responded_at: string | null
        created_at: string
        profiles: { name: string }
      }[]).map((offer) => ({
        id: offer.id,
        productId: offer.product_id,
        buyerId: offer.buyer_id,
        buyerName: offer.profiles.name,
        amount: Number(offer.amount),
        originalPrice,
        message: offer.message ?? undefined,
        status: offer.status,
        createdAt: offer.created_at,
        respondedAt: offer.responded_at ?? undefined,
      }))

      setOffers(mappedOffers)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [productId, originalPrice, userId])

  const createOffer = async (amount: number, message?: string): Promise<{ error: Error | null }> => {
    if (!productId || !userId) {
      return { error: new Error('Bitte melden Sie sich an, um ein Angebot zu machen.') }
    }

    try {
      const insertData = {
        product_id: productId,
        buyer_id: userId,
        amount,
        message: message || null,
      }
      const { error: insertError } = await supabase
        .from('offers')
        .insert(insertData as never)

      if (insertError) {
        throw insertError
      }

      // Refetch to get the new offer
      await fetchOffers()

      // Create notification for seller
      if (sellerId) {
        await createNotification({
          userId: sellerId,
          type: 'offer_received',
          title: 'Neues Preisangebot',
          message: `Angebot über ${amount.toLocaleString('de-AT')} € erhalten`,
          productId,
        })
      }

      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }

  const respondToOffer = async (
    offerId: string,
    status: 'accepted' | 'declined'
  ): Promise<{ error: Error | null }> => {
    if (!userId) {
      return { error: new Error('Bitte melden Sie sich an.') }
    }

    // Find the offer to get buyerId for notification
    const offer = offers.find((o) => o.id === offerId)
    if (!offer) {
      return { error: new Error('Angebot nicht gefunden.') }
    }

    try {
      const { error: updateError } = await supabase
        .from('offers')
        .update({
          status,
          responded_at: new Date().toISOString(),
        })
        .eq('id', offerId)

      if (updateError) {
        throw updateError
      }

      // Update local state
      setOffers((prev) =>
        prev.map((o) =>
          o.id === offerId
            ? { ...o, status, respondedAt: new Date().toISOString() }
            : o
        )
      )

      // Create notification for buyer
      const notificationType = status === 'accepted' ? 'offer_accepted' : 'offer_declined'
      const notificationTitle = status === 'accepted' ? 'Angebot angenommen' : 'Angebot abgelehnt'
      const notificationMessage = status === 'accepted'
        ? `Ihr Angebot über ${offer.amount.toLocaleString('de-AT')} € wurde angenommen!`
        : `Ihr Angebot über ${offer.amount.toLocaleString('de-AT')} € wurde leider abgelehnt.`

      await createNotification({
        userId: offer.buyerId,
        type: notificationType,
        title: notificationTitle,
        message: notificationMessage,
        productId,
      })

      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }

  useEffect(() => {
    fetchOffers()
  }, [fetchOffers])

  return { offers, loading, error, createOffer, respondToOffer, refetch: fetchOffers }
}

// =============================================================================
// useNotifications - Fetch user notifications
// =============================================================================

interface UseNotificationsResult {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: Error | null
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  refetch: () => Promise<void>
}

export function useNotifications(userId: string | undefined): UseNotificationsResult {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select(`
          id,
          type,
          title,
          message,
          product_id,
          is_read,
          created_at,
          products(title)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20)

      if (fetchError) {
        throw fetchError
      }

      const mappedNotifications: Notification[] = ((data || []) as unknown as {
        id: string
        type: Notification['type']
        title: string
        message: string
        product_id: string | null
        is_read: boolean
        created_at: string
        products: { title: string } | null
      }[]).map((notif) => ({
        id: notif.id,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        productId: notif.product_id || '',
        productTitle: notif.products?.title || '',
        timestamp: notif.created_at,
        isRead: notif.is_read,
      }))

      setNotifications(mappedNotifications)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  const markAsRead = async (notificationId: string): Promise<void> => {
    if (!userId) return

    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', userId)

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      )
    } catch (err) {
      console.error('Failed to mark notification as read:', err)
    }
  }

  const markAllAsRead = async (): Promise<void> => {
    if (!userId) return

    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false)

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  }
}

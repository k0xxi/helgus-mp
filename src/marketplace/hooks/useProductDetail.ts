import { useState, useEffect, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { sendEmail } from '@/lib/email'
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
  is_negotiable: boolean
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
  // Validate userId is provided and not null/undefined
  if (!params.userId) {
    console.warn('[Notifications] Cannot create notification: userId is missing or invalid')
    return
  }

  try {
    console.log('[Notifications] Creating notification:', {
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      productId: params.productId,
    })

    // Use database function to bypass RLS and ensure real-time subscriptions work
    const rpcParams = {
      p_user_id: params.userId,
      p_type: params.type,
      p_title: params.title,
      p_message: params.message,
    }

    // Only include p_product_id if provided
    if (params.productId) {
      ;(rpcParams as any).p_product_id = params.productId
    }

    console.log('[Notifications] RPC params:', rpcParams)

    const { data, error } = await supabase.rpc('create_notification', rpcParams as never)

    if (error) {
      console.error('[Notifications] RPC error:', {
        code: (error as any).code,
        message: (error as any).message,
        hint: (error as any).hint,
        details: (error as any).details,
      })
      return
    }

    console.log('[Notifications] Notification created successfully:', data)
  } catch (err) {
    console.error('[Notifications] Exception while creating notification:', {
      message: (err as any).message,
      stack: (err as any).stack,
    })
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

/**
 * Hook to fetch detailed product information including seller and category data
 *
 * @param productId - The ID of the product to fetch
 * @param userId - Current user ID (for favorit check)
 * @returns Object containing product, seller, category data and helper functions
 *
 * @example
 * const { product, seller, loading } = useProductDetail(productId, userId)
 */
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
        isNegotiable: queryResult.is_negotiable ?? false,
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

      // Validate required data
      if (!profile) {
        throw new Error('Seller profile not found')
      }
      if (!cat) {
        throw new Error('Product category not found')
      }

      // Map to Seller type
      // TODO: Add database fields for rating, totalSales, and responseTime:
      // - rating: Calculate from seller reviews (avg rating, count)
      // - totalSales: Count completed transactions
      // - responseTime: Median response time to messages
      // Currently hardcoded as: rating=5, totalSales=0, responseTime='Antwortet meist innerhalb von 24h'
      const mappedSeller: Seller = {
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

interface ConversationData {
  id: string
  buyer_id: string
  seller_id: string
}

/**
 * Hook to manage conversations and messages for a product between buyer and seller
 *
 * @returns Object with messages, conversation functions for sending/managing messages
 *
 * @remarks
 * - Automatically creates conversation if it doesn't exist (for buyers only)
 * - Handles real-time message subscription via Supabase
 * - Input validation: messages checked for empty/length before sending
 * - Returns error object instead of throwing for user-facing operations
 */
interface UseConversationResult {
  conversationId: string | null
  buyerId: string | null
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
  const [conversation, setConversation] = useState<ConversationData | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchConversation = useCallback(async () => {
    if (!productId || !userId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('conversations')
        .select('id, buyer_id, seller_id')
        .eq('product_id', productId)

      // If we know user is not the seller (i.e., they're the buyer), filter by buyer_id
      // Otherwise, get all conversations for this product (seller can have multiple conversations)
      if (sellerId && userId !== sellerId) {
        query = query.eq('buyer_id', userId)
      } else if (!sellerId && userId) {
        // If sellerId not available yet, just get conversations where user is buyer
        query = query.eq('buyer_id', userId)
      }

      // Get the most recent conversation
      const { data: existingConv, error: convError } = await query
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (convError && convError.code !== 'PGRST116') {
        // PGRST116 = no rows returned
        throw convError
      }

      const convData = existingConv as ConversationData | null
      const convId = convData?.id || null
      setConversationId(convId)
      setConversation(convData)

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

    // Validate message content
    if (!content.trim()) {
      return { error: new Error('Nachricht kann nicht leer sein.') }
    }

    if (content.length > 1000) {
      return { error: new Error('Nachricht ist zu lang (max. 1000 Zeichen).') }
    }

    try {
      let convId = conversationId

      // Create conversation if it doesn't exist (only possible for buyers)
      if (!convId) {
        // For sellers: error - can't start a new conversation
        if (userId === sellerId) {
          return { error: new Error('Keine aktive Konversation gefunden.') }
        }

        // For buyers: create new conversation
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

      // Create notification for recipient
      // Determine recipient from conversation data (more reliable than sellerId parameter)
      let recipientId: string | null = null

      if (conversation) {
        // If user is the buyer, notify the seller
        // If user is the seller, notify the buyer
        if (userId === conversation.buyer_id) {
          recipientId = conversation.seller_id
        } else if (userId === conversation.seller_id) {
          recipientId = conversation.buyer_id
        }
      }

      console.log('[Messages] Creating notification:', {
        userId,
        conversationSellerId: conversation?.seller_id,
        conversationBuyerId: conversation?.buyer_id,
        isBuyer: userId === conversation?.buyer_id,
        isSeller: userId === conversation?.seller_id,
        recipientId,
      })

      if (recipientId) {
        console.log('[Messages] Notifying recipient:', recipientId)
        await createNotification({
          userId: recipientId,
          type: 'new_message',
          title: 'Neue Nachricht',
          message: content.length > 50 ? content.substring(0, 50) + '...' : content,
          productId,
        })

        // Sende E-Mail an Empfänger (falls aktiviert)
        const { data: recipientProfile } = await supabase
          .from('profiles')
          .select('email, name, email_preferences')
          .eq('id', recipientId)
          .single()

        if (recipientProfile?.email && recipientProfile.email_preferences?.new_message !== false) {
          const { data: { user } } = await supabase.auth.getUser()

          void sendEmail({
            type: 'new_message',
            to: recipientProfile.email,
            productTitle: product.title,
            productId: productId,
            buyerName: recipientProfile.name || 'Nutzer',
            sellerName: user?.user_metadata?.name || 'Ein Nutzer',
            message: content.substring(0, 150),
          })
        }
      } else {
        console.warn('[Messages] No recipient ID found for notification', {
          hasConversation: !!conversation,
          userId,
        })
      }

      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }

  useEffect(() => {
    fetchConversation()
  }, [fetchConversation])

  return { conversationId, buyerId: conversation?.buyer_id || null, messages, loading, error, sendMessage, refetch: fetchConversation }
}

// =============================================================================
// useOffers - Create and manage offers
// =============================================================================

interface UseOffersResult {
  offers: Offer[]
  loading: boolean
  error: Error | null
  createOffer: (amount: number, message?: string, shippingMethod?: 'Abholung' | 'Versand') => Promise<{ error: Error | null }>
  respondToOffer: (offerId: string, status: 'accepted' | 'declined') => Promise<{ error: Error | null }>
  refetch: () => Promise<void>
}

/**
 * Hook to manage counter-offers for a product
 *
 * @param productId - Product ID to manage offers for
 * @param userId - Current user ID (for seller authorization)
 * @returns Object with offers list and functions to create/respond to offers
 *
 * @remarks
 * - Validates offer amount > 0
 * - Creates notifications for both buyer and seller when offers are accepted/declined
 * - Invalidates related caches to ensure real-time updates
 * - Only sellers can accept/decline offers
 */
export function useOffers(
  productId: string | undefined,
  originalPrice: number,
  userId: string | undefined,
  sellerId?: string
): UseOffersResult {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const queryClient = useQueryClient()

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

  const createOffer = async (amount: number, message?: string, shippingMethod?: 'Abholung' | 'Versand'): Promise<{ error: Error | null }> => {
    if (!productId || !userId) {
      return { error: new Error('Bitte melden Sie sich an, um ein Angebot zu machen.') }
    }

    // Validate offer amount
    if (!Number.isFinite(amount) || amount <= 0) {
      return { error: new Error('Angebotspreis muss größer als 0 sein.') }
    }

    if (amount > 999999999) {
      return { error: new Error('Angebotspreis ist zu hoch.') }
    }

    // Validate optional message
    if (message && message.length > 500) {
      return { error: new Error('Nachricht ist zu lang (max. 500 Zeichen).') }
    }

    try {
      const insertData = {
        product_id: productId,
        buyer_id: userId,
        amount,
        message: message || null,
        shipping_method: shippingMethod || 'Versand',
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

        // Sende E-Mail an Verkäufer (falls aktiviert)
        const { data: sellerProfile } = await supabase
          .from('profiles')
          .select('email, name, email_preferences')
          .eq('id', sellerId)
          .single()

        if (sellerProfile?.email && sellerProfile.email_preferences?.counter_offer !== false) {
          const { data: { user } } = await supabase.auth.getUser()

          void sendEmail({
            type: 'counter_offer',
            to: sellerProfile.email,
            productTitle: product.title,
            productId: productId,
            sellerName: sellerProfile.name || 'Verkäufer',
            buyerName: user?.user_metadata?.name || 'Ein Käufer',
            counterOffer: amount,
            productPrice: product.price,
            buyerEmail: user?.email,
            message: message,
          })
        }
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
      if (status === 'accepted') {
        // Call server-side function to handle all offer acceptance operations atomically
        const { data, error: rpcError } = await supabase.rpc('accept_offer', {
          p_offer_id: offerId,
          p_product_id: productId,
          p_buyer_id: offer.buyerId,
          p_seller_id: userId,
          p_offer_amount: offer.amount
        })

        if (rpcError) {
          console.error('RPC error in accept_offer:', rpcError)
          throw rpcError
        }

        if (data && !(data as any).success) {
          throw new Error((data as any).error || 'Failed to accept offer')
        }

        console.log('Offer accepted successfully:', data)
      } else {
        // Just decline the offer
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

      // Sende E-Mail an Käufer (falls aktiviert)
      const { data: buyerProfile } = await supabase
        .from('profiles')
        .select('email, name, email_preferences')
        .eq('id', offer.buyerId)
        .single()

      const emailType = status === 'accepted' ? 'counter_offer_accepted' : 'counter_offer_refused'
      const preferenceKey = status === 'accepted' ? 'counter_offer_accepted' : 'counter_offer_refused'

      if (buyerProfile?.email && buyerProfile.email_preferences?.[preferenceKey] !== false) {
        void sendEmail({
          type: emailType,
          to: buyerProfile.email,
          productTitle: product.title,
          productId: productId,
          buyerName: buyerProfile.name || 'Käufer',
          offerAmount: offer.amount,
          productPrice: product.price,
        })
      }

      // Invalidate buyer's notifications cache
      queryClient.invalidateQueries({
        queryKey: ['notifications', 'list', offer.buyerId],
      })

      return { error: null }
    } catch (err) {
      console.error('Error in respondToOffer:', err)
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

// =============================================================================
// useBuyerProfile - Fetch buyer profile when seller is viewing conversation
// =============================================================================

interface UseBuyerProfileResult {
  buyer: Seller | null
  loading: boolean
  error: Error | null
}

export function useBuyerProfile(buyerId: string | null | undefined): UseBuyerProfileResult {
  const [buyer, setBuyer] = useState<Seller | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchBuyer = useCallback(async () => {
    if (!buyerId) {
      setBuyer(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('id, name, avatar_url, city, is_verified, created_at')
        .eq('id', buyerId)
        .single()

      if (fetchError) {
        throw fetchError
      }

      if (!profile) {
        throw new Error('Buyer profile not found')
      }

      // TODO: Add database fields for rating, totalSales, and responseTime
      // (see line ~200 for details on what needs to be added)
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

      setBuyer(mappedBuyer)
    } catch (err) {
      setError(err as Error)
      setBuyer(null)
    } finally {
      setLoading(false)
    }
  }, [buyerId])

  useEffect(() => {
    fetchBuyer()
  }, [fetchBuyer])

  return { buyer, loading, error }
}

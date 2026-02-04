import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, Loader2 } from 'lucide-react'
import { ProductDetail } from '@/sections/produktdetails-verhandlung/components/ProductDetail'
import { PurchaseModal } from '@/components/PurchaseModal'
import { OfferModal } from '@/components/OfferModal'
import {
  useProductDetail,
  useOffers,
  useProductConversationsQuery,
  useProductConversationsListQuery,
  useConversationMessagesQuery,
  useBuyerProfileQuery,
  useSendMessageMutation,
  useMarkMessagesAsReadMutation,
  useMessagesSubscription,
  useConversationsSubscription,
  usePurchase,
} from '@/hooks'
import { useFavorites } from '@/hooks/useFavorites'
import { useAuth } from '@/context/AuthContext'

export function ProductPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, profile } = useAuth()
  const { createDirectPurchase } = usePurchase(user?.id)
  const [isTyping, setIsTyping] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)

  // Purchase modal state
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [purchaseLoading, setPurchaseLoading] = useState(false)
  const [purchaseError, setPurchaseError] = useState<string | null>(null)

  // Offer modal state
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [offerLoading, setOfferLoading] = useState(false)
  const [offerError, setOfferError] = useState<string | null>(null)

  // Track whether chat should be open (persists even after URL param is cleared)
  const [shouldInitiallyChatOpen, setShouldInitiallyChatOpen] = useState(false)

  // Get conversationId from URL params (for sellers navigating from messages page)
  const urlConversationId = searchParams.get('conversationId')

  // Detect if chat should open from URL param
  useEffect(() => {
    const openChatParam = searchParams.get('openChat') === 'true'
    if (openChatParam && !shouldInitiallyChatOpen) {
      setShouldInitiallyChatOpen(true)
    }
  }, [searchParams, shouldInitiallyChatOpen])

  // Scroll to section if hash is present
  useEffect(() => {
    if (location.hash === '#gegenangebote') {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        const section = document.getElementById('gegenangebote')
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }, [location.hash])

  // Handle typing indicator timeout
  useEffect(() => {
    return () => {
      if (typingTimeout) clearTimeout(typingTimeout)
    }
  }, [typingTimeout])

  // Favorites hook
  const { isFavorited, toggleFavorite } = useFavorites(user?.id)
  const isProductFavorited = productId ? isFavorited(productId) : false

  // Product detail hook
  const {
    product,
    seller,
    category,
    loading: productLoading,
    error: productError,
    incrementViewCount,
  } = useProductDetail(productId, user?.id, isProductFavorited)

  // Conversation query (React Query)
  // Pass conversationId from URL if present (for sellers navigating from messages page)
  const {
    data: conversation,
    isLoading: conversationLoading,
  } = useProductConversationsQuery(productId, seller?.id, user?.id, urlConversationId)

  // Product conversations list query (for seller sidebar showing all conversations)
  const {
    data: productConversations = [],
  } = useProductConversationsListQuery(
    productId,
    user?.id === seller?.id ? seller?.id : undefined
  )

  // Messages query (React Query)
  const {
    data: messages = [],
    isLoading: messagesLoading,
  } = useConversationMessagesQuery(conversation?.id, user?.id)

  // Buyer profile query (React Query)
  const {
    data: buyerProfile,
  } = useBuyerProfileQuery(conversation?.buyer_id)

  // Send message mutation (React Query)
  const {
    mutateAsync: sendMessage,
    isPending: isSendingMessage,
  } = useSendMessageMutation()

  // Mark messages as read mutation (React Query)
  const {
    mutate: markMessagesAsRead,
  } = useMarkMessagesAsReadMutation()

  // Real-time message subscriptions
  useMessagesSubscription(conversation?.id, productId)
  useConversationsSubscription(user?.id)

  // Offers hook
  const {
    offers,
    createOffer,
    respondToOffer,
  } = useOffers(productId, product?.price || 0, user?.id, seller?.id)


  // Clear the openChat param after detecting it (to keep URL clean)
  useEffect(() => {
    if (searchParams.has('openChat')) {
      const params = new URLSearchParams(searchParams)
      params.delete('openChat')
      setSearchParams(params, { replace: true })
    }
  }, []) // Only run once on mount

  // Increment view count on first load
  useEffect(() => {
    if (product && productId) {
      incrementViewCount()
    }
    // Only run once when product loads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, !!product])

  // Mark messages as read when viewing a conversation
  useEffect(() => {
    if (conversation?.id && user?.id && messages.length > 0) {
      // Check if there are unread messages from other users
      const hasUnread = messages.some(msg => !msg.isOwn && !msg.isRead)
      if (hasUnread) {
        markMessagesAsRead({
          conversationId: conversation.id,
          userId: user.id,
        })
      }
    }
  }, [conversation?.id, user?.id, messages, markMessagesAsRead])

  // Loading state
  if (productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 text-slate-400 animate-spin" />
          <p className="mt-4 text-slate-600 dark:text-slate-400">Produkt wird geladen...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (productError || !product || !seller || !category) {
    return (
      <div className="space-y-6 p-6">
        <button
          onClick={() => navigate('/search')}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück zur Suche
        </button>

        <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 p-8 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 font-semibold text-red-800 dark:text-red-200">
            Produkt nicht gefunden
          </h2>
          <p className="mt-2 text-sm text-red-600 dark:text-red-300">
            {productError?.message || 'Das gewünschte Produkt konnte nicht gefunden werden.'}
          </p>
          <button
            onClick={() => navigate('/search')}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Zur Produktsuche
          </button>
        </div>
      </div>
    )
  }

  // Update product with current favorite state
  const productWithFavorite = {
    ...product,
    isFavorite: isProductFavorited,
  }

  // Current user object for the component
  const currentUser = {
    id: user?.id || '',
    name: profile?.name || 'Gast',
  }

  // Handlers
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/search')
    }
  }

  const handleCategoryClick = (slug: string) => {
    if (slug === 'alle-produkte') {
      navigate('/search')
    } else {
      navigate(`/search?category=${encodeURIComponent(category.main.name)}`)
    }
  }

  const handleMakeOffer = () => {
    if (!user) {
      navigate('/auth')
      return
    }
    setShowOfferModal(true)
    setOfferError(null)
  }

  const handleConfirmOffer = async (amount: number, message?: string, shippingMethod?: 'Abholung' | 'Versand') => {
    setOfferLoading(true)
    setOfferError(null)

    try {
      const { error } = await createOffer(amount, message, shippingMethod)
      if (error) {
        console.error('Error creating offer:', error)
        setOfferError('Fehler beim Erstellen des Angebots. Bitte versuchen Sie es erneut.')
      } else {
        setShowOfferModal(false)
      }
    } catch (err) {
      console.error('Offer creation error:', err)
      setOfferError('Fehler beim Erstellen des Angebots. Bitte versuchen Sie es erneut.')
    } finally {
      setOfferLoading(false)
    }
  }

  const handleCloseOfferModal = () => {
    if (!offerLoading) {
      setShowOfferModal(false)
      setOfferError(null)
    }
  }

  const handleBuyRequest = () => {
    if (!user) {
      navigate('/auth')
      return
    }

    if (!productId || !product?.sellerId || !product?.price) {
      console.error('Missing product information')
      setPurchaseError('Fehler beim Laden des Produkts. Bitte versuchen Sie es erneut.')
      return
    }

    // Open the purchase modal
    setShowPurchaseModal(true)
    setPurchaseError(null)
  }

  const handleConfirmPurchase = async (shippingMethod: 'Abholung' | 'Versand') => {
    if (!product?.sellerId || !productId || !product?.price) {
      return
    }

    setPurchaseLoading(true)
    setPurchaseError(null)

    try {
      const { error } = await createDirectPurchase(productId, product.sellerId, product.price, shippingMethod)

      if (error) {
        console.error('Error creating purchase:', error)
        setPurchaseError('Fehler beim Kauf. Bitte versuchen Sie es erneut.')
      } else {
        setShowPurchaseModal(false)
        // Show success and navigate
        alert('Kauf erfolgreich! Der Verkäufer wurde benachrichtigt.')
        navigate('/my-purchases')
      }
    } catch (err) {
      console.error('Purchase error:', err)
      setPurchaseError('Fehler beim Kauf. Bitte versuchen Sie es erneut.')
    } finally {
      setPurchaseLoading(false)
    }
  }

  const handleClosePurchaseModal = () => {
    if (!purchaseLoading) {
      setShowPurchaseModal(false)
      setPurchaseError(null)
    }
  }

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate('/auth')
      return
    }
    if (productId) {
      const { error } = await toggleFavorite(productId)
      if (error) {
        console.error('Error toggling favorite:', error)
      }
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    const title = product.title

    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url)
        // Could show a toast notification here
      } catch (err) {
        console.error('Failed to copy URL:', err)
      }
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!user) {
      navigate('/auth')
      return
    }

    if (!productId || !seller?.id) {
      console.error('Missing product or seller information')
      return
    }

    try {
      // Show typing indicator for outgoing messages
      setIsTyping(true)

      await sendMessage({
        conversationId: conversation?.id,
        content,
        userId: user.id,
        productId,
        sellerId: seller.id,
      })

      // Clear typing indicator after send
      setIsTyping(false)
    } catch (error) {
      console.error('Error sending message:', error)
      setIsTyping(false)
    }
  }

  const handleViewSellerProfile = (sellerId: string) => {
    navigate(`/profile/${sellerId}`)
  }

  const handleRespondToOffer = async (offerId: string, status: 'accepted' | 'declined') => {
    if (!user) {
      navigate('/auth')
      return
    }
    const { error } = await respondToOffer(offerId, status)
    if (error) {
      console.error('Error responding to offer:', error)
    }
  }

  const handleSelectConversation = (conversationId: string) => {
    // Update URL to select this conversation
    setSearchParams(
      (current) => {
        const params = new URLSearchParams(current)
        params.set('conversationId', conversationId)
        return params
      },
      { replace: false }
    )
  }

  return (
    <>
      <ProductDetail
        product={productWithFavorite}
        seller={seller}
        buyer={buyerProfile}
        category={category}
        messages={messages}
        offers={offers}
        currentUser={currentUser as any}
        isAuthenticated={!!user}
        notifications={[]}
        isTyping={isTyping}
        onBack={handleBack}
        onCategoryClick={handleCategoryClick}
        onMakeOffer={handleMakeOffer}
        onBuyRequest={handleBuyRequest}
        onToggleFavorite={handleToggleFavorite}
        onShare={handleShare}
        onSendMessage={handleSendMessage}
        onViewSellerProfile={handleViewSellerProfile}
        onAcceptOffer={(offerId) => handleRespondToOffer(offerId, 'accepted')}
        onDeclineOffer={(offerId) => handleRespondToOffer(offerId, 'declined')}
        initialChatOpen={shouldInitiallyChatOpen}
        productConversations={productConversations}
        selectedConversationId={conversation?.id}
        onSelectConversation={handleSelectConversation}
      />

      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={showPurchaseModal}
        data={
          product && seller
            ? {
                productId: productId || '',
                productTitle: product.title,
                price: product.price,
                shippingCost: product.shippingOptions.shippingCost,
                productImage: product.images?.[0]?.url,
                sellerName: seller.name,
                sellerCity: seller.city,
                deliveryOptions: [
                  ...(product.shippingOptions.pickup ? (['abholung'] as const) : []),
                  ...(product.shippingOptions.shipping ? (['versand'] as const) : []),
                ] as ('abholung' | 'versand')[],
              }
            : undefined
        }
        isLoading={purchaseLoading}
        error={purchaseError ?? undefined}
        onConfirm={handleConfirmPurchase}
        onCancel={handleClosePurchaseModal}
      />

      {/* Offer Modal */}
      <OfferModal
        isOpen={showOfferModal}
        data={
          product && seller
            ? {
                productId: productId || '',
                productTitle: product.title,
                productPrice: product.price,
                shippingCost: product.shippingOptions.shippingCost,
                productImage: product.images?.[0]?.url,
                sellerName: seller.name,
                deliveryOptions: [
                  ...(product.shippingOptions.pickup ? (['abholung'] as const) : []),
                  ...(product.shippingOptions.shipping ? (['versand'] as const) : []),
                ] as ('abholung' | 'versand')[],
              }
            : undefined
        }
        isLoading={offerLoading}
        error={offerError ?? undefined}
        onConfirm={handleConfirmOffer}
        onCancel={handleCloseOfferModal}
      />
    </>
  )
}

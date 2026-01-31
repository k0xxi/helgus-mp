import { useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, Loader2 } from 'lucide-react'
import { ProductDetail } from '@/sections/produktdetails-verhandlung/components/ProductDetail'
import { useProductDetail, useConversation, useOffers, useNotifications } from '@/marketplace/hooks/useProductDetail'
import { useFavorites } from '@/marketplace/hooks/useFavorites'
import { useAuth } from '@/marketplace/context/AuthContext'

export function ProductPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, profile } = useAuth()

  // Check if chat should open automatically (from notification click)
  const shouldOpenChat = searchParams.get('openChat') === 'true'

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

  // Conversation hook
  const {
    messages,
    sendMessage,
  } = useConversation(productId, seller?.id, user?.id)

  // Offers hook
  const {
    offers,
    createOffer,
    respondToOffer,
  } = useOffers(productId, product?.price || 0, user?.id, seller?.id)

  // Notifications hook
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications(user?.id)

  // Clear the openChat param after reading it
  useEffect(() => {
    if (shouldOpenChat) {
      searchParams.delete('openChat')
      setSearchParams(searchParams, { replace: true })
    }
  }, [shouldOpenChat, searchParams, setSearchParams])

  // Increment view count on first load
  useEffect(() => {
    if (product && productId) {
      incrementViewCount()
    }
    // Only run once when product loads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, !!product])

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
          onClick={() => navigate('/marketplace/search')}
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
            onClick={() => navigate('/marketplace/search')}
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
    unreadNotifications: unreadCount,
  }

  // Handlers
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/marketplace/search')
    }
  }

  const handleCategoryClick = (slug: string) => {
    if (slug === 'alle-produkte') {
      navigate('/marketplace/search')
    } else {
      navigate(`/marketplace/search?category=${encodeURIComponent(category.main.name)}`)
    }
  }

  const handleMakeOffer = async (amount: number, message?: string) => {
    if (!user) {
      navigate('/marketplace/auth')
      return
    }
    const { error } = await createOffer(amount, message)
    if (error) {
      console.error('Error creating offer:', error)
      // Could show a toast notification here
    }
  }

  const handleBuyRequest = () => {
    if (!user) {
      navigate('/marketplace/auth')
      return
    }
    // For now, just open chat - actual buy flow can be implemented later
    // Could also navigate to a checkout page
    console.log('Buy request for product:', productId)
  }

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate('/marketplace/auth')
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
        console.log('Share cancelled or failed:', err)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url)
        // Could show a toast notification here
        console.log('URL copied to clipboard')
      } catch (err) {
        console.error('Failed to copy URL:', err)
      }
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!user) {
      navigate('/marketplace/auth')
      return
    }
    const { error } = await sendMessage(content)
    if (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleViewSellerProfile = (sellerId: string) => {
    navigate(`/marketplace/profile/${sellerId}`)
  }

  const handleNotificationClick = (notification: { id: string; productId: string; type: string }) => {
    if (notification.productId) {
      // Add openChat param for message notifications
      const chatParam = notification.type === 'new_message' ? '?openChat=true' : ''
      navigate(`/marketplace/product/${notification.productId}${chatParam}`)
    }
    markAsRead(notification.id)
  }

  const handleRespondToOffer = async (offerId: string, status: 'accepted' | 'declined') => {
    if (!user) {
      navigate('/marketplace/auth')
      return
    }
    const { error } = await respondToOffer(offerId, status)
    if (error) {
      console.error('Error responding to offer:', error)
    }
  }

  return (
    <ProductDetail
      product={productWithFavorite}
      seller={seller}
      category={category}
      messages={messages}
      offers={offers}
      notifications={notifications}
      currentUser={currentUser}
      onBack={handleBack}
      onCategoryClick={handleCategoryClick}
      onMakeOffer={handleMakeOffer}
      onBuyRequest={handleBuyRequest}
      onToggleFavorite={handleToggleFavorite}
      onShare={handleShare}
      onSendMessage={handleSendMessage}
      onViewSellerProfile={handleViewSellerProfile}
      onMarkNotificationRead={markAsRead}
      onMarkAllNotificationsRead={markAllAsRead}
      onNotificationClick={handleNotificationClick}
      onAcceptOffer={(offerId) => handleRespondToOffer(offerId, 'accepted')}
      onDeclineOffer={(offerId) => handleRespondToOffer(offerId, 'declined')}
      initialChatOpen={shouldOpenChat}
    />
  )
}

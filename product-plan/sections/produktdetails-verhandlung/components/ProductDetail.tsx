import { useState } from 'react'
import type { ProductDetailProps } from '../types'
import { ImageGallery } from './ImageGallery'
import { SellerCard } from './SellerCard'
import { ChatDrawer } from './ChatDrawer'
import { OfferModal } from './OfferModal'
import { NotificationDropdown } from './NotificationDropdown'

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('de-AT', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatPrice(price: number): string {
  return price.toLocaleString('de-AT', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

export function ProductDetail({
  product,
  seller,
  category,
  messages,
  notifications,
  currentUser,
  onBack,
  onCategoryClick,
  onMakeOffer,
  onBuyRequest,
  onToggleFavorite,
  onShare,
  onSendMessage,
  onViewSellerProfile,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onNotificationClick
}: ProductDetailProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sticky Header Bar */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Zurück</span>
            </button>

            <NotificationDropdown
              notifications={notifications}
              unreadCount={currentUser.unreadNotifications}
              onNotificationClick={onNotificationClick}
              onMarkRead={onMarkNotificationRead}
              onMarkAllRead={onMarkAllNotificationsRead}
            />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <button
            onClick={() => onCategoryClick?.('alle-produkte')}
            className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            Alle Produkte
          </button>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <button
            onClick={() => onCategoryClick?.(category.main.slug)}
            className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            {category.main.name}
          </button>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <button
            onClick={() => onCategoryClick?.(category.sub.slug)}
            className="text-slate-600 dark:text-slate-300 font-medium"
          >
            {category.sub.name}
          </button>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Images */}
          <div>
            <ImageGallery images={product.images} />
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Title & Price */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                {product.title}
              </h1>
              <p className="text-3xl sm:text-4xl font-bold text-red-600 dark:text-red-500 mt-3">
                {formatPrice(product.price)} €
              </p>
            </div>

            {/* Make Offer Button */}
            <button
              onClick={() => setIsOfferModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Gegenangebot machen
            </button>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-medium rounded-full">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {product.condition}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-full">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {product.postalCode}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-full">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(product.createdAt)}
              </span>
            </div>

            {/* Shipping Options */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Versandoptionen</h3>
              <div className="space-y-2">
                {product.shippingOptions.pickup && (
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Abholung möglich</span>
                  </div>
                )}
                {product.shippingOptions.shipping && (
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>
                      Versand möglich
                      {product.shippingOptions.shippingCost && (
                        <span className="text-slate-400 dark:text-slate-500 ml-1">
                          (+{formatPrice(product.shippingOptions.shippingCost)} €)
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Beschreibung</h3>
              <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Seller Card */}
            <SellerCard
              seller={seller}
              onSendMessage={() => setIsChatOpen(true)}
              onViewProfile={() => onViewSellerProfile?.(seller.id)}
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onBuyRequest}
                className="flex-1 px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-500/20"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Kaufen
              </button>
              <button
                onClick={() => onToggleFavorite?.(product.id)}
                className={`px-4 py-4 rounded-xl border transition-colors ${
                  product.isFavorite
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400'
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill={product.isFavorite ? 'currentColor' : 'none'}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button
                onClick={() => onShare?.(product.id)}
                className="px-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>

            {/* View Count */}
            <p className="text-sm text-slate-400 dark:text-slate-500 text-center">
              {product.viewCount} Aufrufe
            </p>
          </div>
        </div>
      </main>

      {/* Chat Drawer */}
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={messages}
        seller={seller}
        onSendMessage={onSendMessage}
      />

      {/* Offer Modal */}
      <OfferModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        productTitle={product.title}
        originalPrice={product.price}
        onSubmit={onMakeOffer}
      />
    </div>
  )
}

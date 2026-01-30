import React from 'react'
import { Heart, MapPin, Edit, Trash2, Package, Home, Phone, Clock } from 'lucide-react'
import type { Product } from '../types'

interface ProductCardProps {
  product: Product
  onView?: () => void
  onToggleFavorite?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export function ProductCard({
  product,
  onView,
  onToggleFavorite,
  onEdit,
  onDelete,
}: ProductCardProps) {
  // Calculate if product is new (< 24 hours)
  const isNew = () => {
    const now = new Date()
    const created = new Date(product.createdAt)
    const diffHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60)
    return diffHours < 24
  }

  // Format relative time
  const formatRelativeTime = () => {
    const now = new Date()
    const created = new Date(product.createdAt)
    const diffMs = now.getTime() - created.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) return `vor ${diffMins} Min.`
    if (diffHours < 24) return `vor ${diffHours} Std.`
    return `vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`
  }

  // Map condition to display text and color
  const getConditionBadge = () => {
    const conditions: Record<typeof product.condition, { label: string; className: string }> = {
      'neu': { label: 'Neu', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
      'wie-neu': { label: 'Wie neu', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
      'sehr-gut': { label: 'Sehr gut', className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
      'gut': { label: 'Gut', className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
      'akzeptabel': { label: 'Akzeptabel', className: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500' },
    }
    return conditions[product.condition]
  }

  // Map delivery options to display
  const getDeliveryText = () => {
    if (product.deliveryOptions.includes('abholung') && product.deliveryOptions.includes('versand')) {
      return 'Abholung & Versand'
    }
    if (product.deliveryOptions.includes('abholung')) {
      return 'Nur Abholung'
    }
    return 'Nur Versand'
  }

  const conditionBadge = getConditionBadge()

  return (
    <div
      className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group flex flex-col"
      onClick={onView}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-900">
        {product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-slate-300 dark:text-slate-600" />
          </div>
        )}

        {/* Favorite Icon (not shown for own products) */}
        {!product.isOwn && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite?.()
            }}
            className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-slate-800/90 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-colors"
            aria-label="Zu Favoriten hinzufügen"
          >
            <Heart
              className={`w-5 h-5 ${
                product.isFavorited
                  ? 'fill-red-500 text-red-500'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            />
          </button>
        )}

        {/* Edit/Delete Icons (only for own products) */}
        {product.isOwn && (
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.()
              }}
              className="p-2 bg-white/90 dark:bg-slate-800/90 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-colors"
              aria-label="Bearbeiten"
            >
              <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.()
              }}
              className="p-2 bg-white/90 dark:bg-slate-800/90 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-colors"
              aria-label="Löschen"
            >
              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
            </button>
          </div>
        )}

        {/* New Badge */}
        {isNew() && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
              NEU
            </span>
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute bottom-3 right-3">
          <span className="px-3 py-1.5 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm text-red-600 dark:text-red-500 text-xl font-bold rounded-lg shadow-lg">
            € {product.price}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title */}
        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4 line-clamp-2 font-['DM_Sans']">
          {product.title}
        </h3>

        {/* Condition Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`px-2 py-1 text-xs font-medium rounded ${conditionBadge.className}`}>
            Zustand: {conditionBadge.label}
          </span>
        </div>

        {/* Delivery Options */}
        <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 mb-2.5">
          {product.deliveryOptions.includes('versand') ? (
            <Package className="w-4 h-4" />
          ) : (
            <Home className="w-4 h-4" />
          )}
          <span className="font-['Inter']">{getDeliveryText()}</span>
        </div>

        {/* Phone Contact */}
        {product.phoneContactAvailable && (
          <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 mb-2.5">
            <Phone className="w-4 h-4" />
            <span className="font-['Inter']">Telefonischer Kontakt möglich</span>
          </div>
        )}

        {/* Location & Time */}
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 pt-4 mt-auto border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span className="font-['Inter']">{product.location.zip}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span className="font-['Inter'] text-xs">{formatRelativeTime()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

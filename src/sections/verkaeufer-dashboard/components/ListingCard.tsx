import type { SellerProduct, ProductStatus } from '@/../product/sections/verkaeufer-dashboard/types'

interface ListingCardProps {
  product: SellerProduct
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onTogglePause?: () => void
  onMarkAsSold?: () => void
}

// Icons
function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  )
}

function MessageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
    </svg>
  )
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  )
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
  )
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  )
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
    </svg>
  )
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  )
}

function EllipsisIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
    </svg>
  )
}

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  )
}

const statusConfig: Record<ProductStatus, { label: string; className: string }> = {
  aktiv: {
    label: 'Aktiv',
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  },
  verkauft: {
    label: 'Verkauft',
    className: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
  },
  pausiert: {
    label: 'Pausiert',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
  },
  abgelaufen: {
    label: 'Abgelaufen',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }
}

const conditionLabels: Record<string, string> = {
  'neu': 'Neu',
  'wie-neu': 'Wie neu',
  'sehr-gut': 'Sehr gut',
  'gut': 'Gut',
  'akzeptabel': 'Akzeptabel'
}

export function ListingCard({
  product,
  onView,
  onEdit,
  onDelete,
  onTogglePause,
  onMarkAsSold
}: ListingCardProps) {
  const status = statusConfig[product.status]
  const isPaused = product.status === 'pausiert'
  const isSold = product.status === 'verkauft'
  const canEdit = !isSold

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-700">
        <img
          src={product.images[0]}
          alt={product.title}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${isSold ? 'opacity-60 grayscale' : ''}`}
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${status.className}`}>
            {status.label}
          </span>
        </div>

        {/* Shipping Badge */}
        {product.shippingAvailable && (
          <div className="absolute top-3 right-3">
            <span className="flex items-center gap-1 px-2 py-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full text-xs text-slate-600 dark:text-slate-300">
              <TruckIcon className="w-3.5 h-3.5" />
              Versand
            </span>
          </div>
        )}

        {/* Image Count */}
        {product.images.length > 1 && (
          <div className="absolute bottom-3 right-3">
            <span className="px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md text-xs text-white">
              1/{product.images.length}
            </span>
          </div>
        )}

        {/* Sold Overlay */}
        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="px-4 py-2 bg-slate-900/80 text-white font-semibold rounded-lg">
              Verkauft
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title & Price */}
        <div className="mb-3">
          <h3
            className="font-semibold text-slate-900 dark:text-white line-clamp-2 mb-1 cursor-pointer hover:text-red-600 dark:hover:text-red-400 transition-colors"
            onClick={onView}
          >
            {product.title}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {product.price.toLocaleString('de-DE')}€
            </span>
            {product.negotiable && (
              <span className="text-xs text-slate-500 dark:text-slate-400">VB</span>
            )}
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-3">
          <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded">
            {conditionLabels[product.condition] || product.condition}
          </span>
          <span className="mx-1">•</span>
          <span>{product.location.city}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
          <span className="flex items-center gap-1.5">
            <EyeIcon className="w-4 h-4" />
            {product.views}
          </span>
          <span className="flex items-center gap-1.5">
            <MessageIcon className="w-4 h-4" />
            {product.inquiries}
          </span>
          <span className="flex items-center gap-1.5">
            <HeartIcon className="w-4 h-4" />
            {product.favorites}
          </span>
        </div>

        {/* Date */}
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
          Erstellt am {formatDate(product.createdAt)}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
          {canEdit && (
            <>
              <button
                onClick={onEdit}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
              >
                <PencilIcon className="w-4 h-4" />
                Bearbeiten
              </button>

              <button
                onClick={onTogglePause}
                className={`p-2 rounded-lg transition-colors ${
                  isPaused
                    ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30'
                    : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30'
                }`}
                title={isPaused ? 'Aktivieren' : 'Pausieren'}
              >
                {isPaused ? <PlayIcon className="w-4 h-4" /> : <PauseIcon className="w-4 h-4" />}
              </button>

              {!isSold && product.status === 'aktiv' && (
                <button
                  onClick={onMarkAsSold}
                  className="p-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  title="Als verkauft markieren"
                >
                  <CheckIcon className="w-4 h-4" />
                </button>
              )}
            </>
          )}

          <button
            onClick={onDelete}
            className="p-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            title="Löschen"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

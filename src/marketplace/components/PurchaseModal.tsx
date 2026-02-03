import React, { useState, useEffect } from 'react'
import { X, AlertCircle } from 'lucide-react'

export interface PurchaseModalData {
  productId: string
  productTitle: string
  price: number
  shippingCost?: number | null
  productImage?: string
  sellerName: string
  sellerCity?: string
  deliveryOptions?: ('abholung' | 'versand')[]
}

interface PurchaseModalProps {
  isOpen: boolean
  data?: PurchaseModalData
  isLoading?: boolean
  error?: string
  onConfirm: (shippingMethod: 'Abholung' | 'Versand') => void
  onCancel: () => void
}

export function PurchaseModal({
  isOpen,
  data,
  isLoading = false,
  error,
  onConfirm,
  onCancel
}: PurchaseModalProps) {
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<'Abholung' | 'Versand'>('Versand')

  // Always call useEffect (not conditionally)
  useEffect(() => {
    if (!isOpen || !data) return

    // Get available shipping methods
    const methods = getShippingMethods()

    // Set default based on available methods
    if (methods.length === 1 && methods[0] === 'Abholung') {
      setSelectedShippingMethod('Abholung')
    } else {
      setSelectedShippingMethod('Versand')
    }
  }, [isOpen, data])

  if (!isOpen || !data) return null

  const formatPrice = (price: number) => {
    return price.toLocaleString('de-AT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    })
  }

  // Convert deliveryOptions (lowercase) to shipping methods (capitalized)
  const getShippingMethods = (): ('Abholung' | 'Versand')[] => {
    if (!data?.deliveryOptions || data.deliveryOptions.length === 0) {
      return ['Abholung', 'Versand']
    }
    return data.deliveryOptions.map(option =>
      option === 'abholung' ? 'Abholung' : 'Versand'
    ) as ('Abholung' | 'Versand')[]
  }

  const shippingMethods = getShippingMethods()

  const handleConfirm = () => {
    onConfirm(selectedShippingMethod)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-auto px-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-slate-700 dark:to-slate-600 px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Kaufbestätigung
            </h2>
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Product Card */}
            <div className="flex gap-4">
              {/* Product Image */}
              {data.productImage && (
                <div className="flex-shrink-0">
                  <img
                    src={data.productImage}
                    alt={data.productTitle}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                </div>
              )}

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                  {data.productTitle}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  von {data.sellerName}
                </p>
                {data.sellerCity && (
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    📍 {data.sellerCity}
                  </p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-200 dark:bg-slate-700" />

            {/* Price Section */}
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Produktpreis:
                </span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {formatPrice(data.price)}
                </span>
              </div>
              {data.shippingCost && selectedShippingMethod === 'Versand' && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Versandkosten:
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {formatPrice(data.shippingCost)}
                  </span>
                </div>
              )}
              <div className="h-px bg-slate-200 dark:bg-slate-600 my-2" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Gesamtpreis:
                </span>
                <span className="text-2xl font-bold text-red-600 dark:text-red-500">
                  {formatPrice(
                    data.price +
                    (selectedShippingMethod === 'Versand' && data.shippingCost
                      ? data.shippingCost
                      : 0)
                  )}
                </span>
              </div>
            </div>

            {/* Shipping Method Selection */}
            {shippingMethods.length > 1 && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Versandart wählen
                </label>
                <div className="flex gap-2">
                  {shippingMethods.map(method => (
                    <button
                      key={method}
                      onClick={() => setSelectedShippingMethod(method)}
                      disabled={isLoading}
                      className={`flex-1 px-3 py-2.5 rounded-lg font-medium transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                        selectedShippingMethod === method
                          ? 'bg-red-600 dark:bg-red-500 text-white ring-2 ring-red-300 dark:ring-red-700'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {method === 'Abholung' ? '🏪 Abholung' : '📦 Versand'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Show single shipping method if only one available */}
            {shippingMethods.length === 1 && (
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-medium">Versandart:</span>{' '}
                  {shippingMethods[0] === 'Abholung' ? '🏪 Abholung' : '📦 Versand'}
                </p>
              </div>
            )}

            {/* Terms & Conditions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Mit dem Kauf bestätigst du, dass du den Artikel unter den angegebenen Bedingungen kaufen möchtest. Der Verkäufer wird benachrichtigt.
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="bg-slate-50 dark:bg-slate-700/50 px-6 py-4 flex gap-3 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Abbrechen
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Wird verarbeitet...
                </>
              ) : (
                'Jetzt kaufen'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

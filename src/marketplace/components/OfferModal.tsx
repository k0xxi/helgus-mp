import React, { useState, useEffect } from 'react'
import { X, AlertCircle } from 'lucide-react'

export interface OfferModalData {
  productId: string
  productTitle: string
  productPrice: number
  shippingCost?: number | null
  productImage?: string
  sellerName: string
  deliveryOptions?: ('abholung' | 'versand')[]
}

interface OfferModalProps {
  isOpen: boolean
  data?: OfferModalData
  isLoading?: boolean
  error?: string
  onConfirm: (amount: number, message?: string, shippingMethod?: 'Abholung' | 'Versand') => void
  onCancel: () => void
}

export function OfferModal({
  isOpen,
  data,
  isLoading = false,
  error,
  onConfirm,
  onCancel
}: OfferModalProps) {
  const [offerAmount, setOfferAmount] = useState<string>('')
  const [offerMessage, setOfferMessage] = useState<string>('')
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

    // Reset form
    setOfferAmount('')
    setOfferMessage('')
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
  const offerAmountNum = parseFloat(offerAmount) || 0
  const isOfferValid = offerAmountNum > 0 && offerAmountNum < data.productPrice

  const handleConfirm = () => {
    if (!isOfferValid) return
    onConfirm(offerAmountNum, offerMessage || undefined, selectedShippingMethod)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-auto px-4 max-h-[90vh] overflow-y-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-700 dark:to-slate-600 px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Gegenangebot erstellen
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
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Produktpreis: <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(data.productPrice)}</span>
                  </p>
                  {data.shippingCost && (
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Versand: <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(data.shippingCost)}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-200 dark:bg-slate-700" />

            {/* Offer Amount Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Dein Angebotspreis
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                />
                <span className="text-slate-900 dark:text-white font-medium">€</span>
              </div>
              {offerAmountNum > 0 && !isOfferValid && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  Das Angebot muss unter dem Angebotspreis liegen
                </p>
              )}
            </div>

            {/* Optional Message */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Nachricht (optional)
              </label>
              <textarea
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
                placeholder="Z.B. Kann ich nächste Woche abholen?"
                maxLength={500}
                disabled={isLoading}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 resize-none"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {offerMessage.length}/500
              </p>
            </div>

            {/* Shipping Method Selection */}
            {shippingMethods.length > 1 && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Versandart
                </label>
                <div className="flex gap-2">
                  {shippingMethods.map(method => (
                    <button
                      key={method}
                      onClick={() => setSelectedShippingMethod(method)}
                      disabled={isLoading}
                      className={`flex-1 px-3 py-2.5 rounded-lg font-medium transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                        selectedShippingMethod === method
                          ? 'bg-amber-600 dark:bg-amber-500 text-white ring-2 ring-amber-300 dark:ring-amber-700'
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

            {/* Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Der Verkäufer wird dein Angebot mit der gewählten Versandart sehen und kann es akzeptieren oder ablehnen.
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
              disabled={isLoading || !isOfferValid}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Wird erstellt...
                </>
              ) : (
                'Angebot senden'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

import { useState } from 'react'

interface OfferModalProps {
  isOpen: boolean
  onClose: () => void
  productTitle: string
  originalPrice: number
  onSubmit?: (amount: number, message?: string) => void
}

export function OfferModal({ isOpen, onClose, productTitle, originalPrice, onSubmit }: OfferModalProps) {
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const numAmount = parseFloat(amount)

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Bitte geben Sie einen gültigen Betrag ein')
      return
    }

    if (numAmount >= originalPrice) {
      setError('Das Gegenangebot muss unter dem Originalpreis liegen')
      return
    }

    onSubmit?.(numAmount, message || undefined)
    setAmount('')
    setMessage('')
    setError('')
    onClose()
  }

  const handleClose = () => {
    setAmount('')
    setMessage('')
    setError('')
    onClose()
  }

  const discount = amount ? Math.round((1 - parseFloat(amount) / originalPrice) * 100) : 0

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Gegenangebot machen</h2>
            <button
              onClick={handleClose}
              className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Product Info */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Produkt</p>
              <p className="font-medium text-slate-900 dark:text-white line-clamp-2">{productTitle}</p>
              <p className="text-lg font-bold text-red-600 dark:text-red-400 mt-2">
                {originalPrice.toFixed(2)} €
              </p>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Ihr Angebot
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value)
                    setError('')
                  }}
                  placeholder="0.00"
                  className="w-full px-4 py-3 pr-12 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-lg font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€</span>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-500">{error}</p>
              )}
              {amount && !error && parseFloat(amount) < originalPrice && (
                <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
                  {discount}% unter dem Originalpreis
                </p>
              )}
            </div>

            {/* Message Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Nachricht <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="z.B. Könnte bar abholen..."
                rows={3}
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 text-slate-700 dark:text-slate-300 font-medium border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Angebot senden
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, CheckCircle, Clock, MapPin, MessageSquare } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useMySales } from '@/hooks/useMySales'
import { useMyListings } from '@/hooks/useProfile'

export function MySalesPage() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const { sales, loading: salesLoading } = useMySales(user?.id)
  const { markAsSold } = useMyListings(user?.id)
  const [confirmSoldId, setConfirmSoldId] = useState<string | null>(null)
  const [completingId, setCompletingId] = useState<string | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth')
    }
  }, [user, authLoading, navigate])

  const handleMarkAsSold = async (saleId: string) => {
    if (!confirm('Möchten Sie diesen Verkauf als abgeschlossen markieren?')) {
      return
    }

    setCompletingId(saleId)
    try {
      const { error } = await markAsSold(saleId)
      if (error) {
        console.error('Error marking as sold:', error)
        alert('Fehler beim Aktualisieren des Status.')
      } else {
        setConfirmSoldId(null)
      }
    } finally {
      setCompletingId(null)
    }
  }

  const handleContactBuyer = (buyerId: string) => {
    navigate(`/messages?buyerId=${buyerId}`)
  }

  const loading = authLoading || salesLoading
  const pendingSales = sales.filter(s => s.status === 'pending')
  const soldSales = sales.filter(s => s.status === 'sold')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-slate-800 dark:to-slate-900 rounded-lg px-6 py-8 border border-red-100 dark:border-red-900/30">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="h-5 w-5 text-red-600 dark:text-red-500" />
          <span className="text-sm font-semibold text-red-600 dark:text-red-500">Verkäuferansicht</span>
        </div>
        <div className="mb-3">
          <h1 className="text-[2rem] font-bold text-slate-900 dark:text-white">
            Meine <span className="text-red-600 dark:text-red-500">Verkäufe</span>
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
          Verwalten Sie Ihre aktiven und abgeschlossenen Verkäufe.
        </p>
      </div>

      {sales.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 mb-2">Noch keine Verkäufe</p>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Wenn Käufer Ihre Produkte reservieren, werden sie hier angezeigt.
          </p>
        </div>
      ) : (
        <>
          {/* Pending Sales */}
          {pendingSales.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Ausstehende Verkäufe ({pendingSales.length})
                </h2>
              </div>

              <div className="space-y-3">
                {pendingSales.map(sale => (
                  <div
                    key={sale.id}
                    className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      {sale.productImage && (
                        <img
                          src={sale.productImage}
                          alt={sale.title}
                          className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                        />
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                              {sale.title}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                              Reserviert seit {new Date(sale.pendingSince).toLocaleDateString('de-AT')}
                            </p>
                          </div>
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full text-sm font-medium flex-shrink-0">
                            <Clock className="w-3.5 h-3.5" />
                            Ausstehend
                          </span>
                        </div>

                        {/* Buyer Info */}
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 mb-3">
                          <div className="flex items-center gap-3">
                            {sale.buyerImage ? (
                              <img
                                src={sale.buyerImage}
                                alt={sale.buyerName}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                                {sale.buyerName.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-900 dark:text-white truncate">
                                {sale.buyerName}
                              </p>
                              {sale.buyerCity && (
                                <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {sale.buyerCity}
                                </p>
                              )}
                              {sale.shippingMethod && (
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                  <span className="font-medium">Versandart:</span> {sale.shippingMethod === 'Abholung' ? '🏪 Abholung' : '📦 Versand'}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Price and Actions */}
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-red-600 dark:text-red-500">
                            {sale.price.toLocaleString('de-AT')} €
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleContactBuyer(sale.buyerId)}
                              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                            >
                              <MessageSquare className="w-4 h-4" />
                              Kontakt
                            </button>
                            <button
                              onClick={() => setConfirmSoldId(sale.id)}
                              disabled={completingId === sale.id}
                              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Abschließen
                            </button>
                          </div>
                        </div>

                        {/* Confirmation Message */}
                        {confirmSoldId === sale.id && (
                          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">
                              Möchten Sie diesen Verkauf wirklich als abgeschlossen markieren?
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleMarkAsSold(sale.id)}
                                disabled={completingId === sale.id}
                                className="px-3 py-1 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded transition-colors disabled:opacity-50"
                              >
                                {completingId === sale.id ? 'Wird gespeichert...' : 'Ja, abschließen'}
                              </button>
                              <button
                                onClick={() => setConfirmSoldId(null)}
                                disabled={completingId === sale.id}
                                className="px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors disabled:opacity-50"
                              >
                                Abbrechen
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sold Sales */}
          {soldSales.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Abgeschlossene Verkäufe ({soldSales.length})
                </h2>
              </div>

              <div className="space-y-3">
                {soldSales.map(sale => (
                  <div
                    key={sale.id}
                    className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 opacity-75"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      {sale.productImage && (
                        <img
                          src={sale.productImage}
                          alt={sale.title}
                          className="w-24 h-24 rounded-lg object-cover flex-shrink-0 grayscale"
                        />
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                              {sale.title}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                              Verkauft am {new Date(sale.soldAt || '').toLocaleDateString('de-AT')}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                              Käufer: {sale.buyerName}
                            </p>
                            {sale.shippingMethod && (
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                <span className="font-medium">Versandart:</span> {sale.shippingMethod === 'Abholung' ? '🏪 Abholung' : '📦 Versand'}
                              </p>
                            )}
                          </div>
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-sm font-medium flex-shrink-0">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Verkauft
                          </span>
                        </div>
                        <span className="text-lg font-bold text-green-600 dark:text-green-500 mt-2 inline-block">
                          {sale.price.toLocaleString('de-AT')} €
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

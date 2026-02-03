import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, MessageSquare } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/marketplace/context/AuthContext'
import type { Purchase } from '@/types/marketplace'

interface PurchaseWithDetails extends Purchase {
  productTitle?: string
  productImage?: string
  sellerName?: string
}

export function MyPurchasesPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [purchases, setPurchases] = useState<PurchaseWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all')

  useEffect(() => {
    if (!user?.id) {
      navigate('/marketplace/auth')
      return
    }

    const fetchPurchases = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('purchases')
          .select(`
            *,
            products(id, title, product_images(storage_path)),
            profiles!seller_id(id, name)
          `)
          .eq('buyer_id', user.id)
          .order('purchased_at', { ascending: false })

        if (error) {
          throw error
        }

        const mappedPurchases = (data || []).map((purchase: any) => {
          const productImage = purchase.products?.product_images?.[0]?.storage_path
            ? supabase.storage.from('products').getPublicUrl(purchase.products.product_images[0].storage_path).data.publicUrl
            : '/placeholder-product.jpg'

          return {
            id: purchase.id,
            productId: purchase.product_id,
            sellerId: purchase.seller_id,
            buyerId: purchase.buyer_id,
            priceAtPurchase: Number(purchase.price_at_purchase),
            purchaseType: purchase.purchase_type,
            offerId: purchase.offer_id,
            status: purchase.status,
            purchasedAt: new Date(purchase.purchased_at),
            completedAt: purchase.completed_at ? new Date(purchase.completed_at) : null,
            cancelledAt: purchase.cancelled_at ? new Date(purchase.cancelled_at) : null,
            productTitle: purchase.products?.title,
            productImage,
            sellerName: purchase.profiles?.name,
          }
        })

        setPurchases(mappedPurchases)
      } catch (err) {
        console.error('Error fetching purchases:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPurchases()
  }, [user?.id, navigate])

  const filteredPurchases = statusFilter === 'all'
    ? purchases
    : purchases.filter(p => p.status === statusFilter)

  const statusCounts = {
    all: purchases.length,
    pending: purchases.filter(p => p.status === 'pending').length,
    completed: purchases.filter(p => p.status === 'completed').length,
    cancelled: purchases.filter(p => p.status === 'cancelled').length,
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Ausstehend'
      case 'completed':
        return 'Abgeschlossen'
      case 'cancelled':
        return 'Storniert'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'cancelled':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-slate-800 dark:to-slate-900 rounded-lg px-6 py-8 border border-red-100 dark:border-red-900/30">
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-red-600 dark:text-red-500" />
          <span className="text-sm font-semibold text-red-600 dark:text-red-500">Einkäufe</span>
        </div>
        <h1 className="text-[2rem] font-bold text-slate-900 dark:text-slate-100">
          Meine <span className="text-red-600 dark:text-red-500">Käufe</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mt-2">
          Verwalten Sie Ihre gekauften Artikel und verfolgen Sie den Status Ihrer Bestellungen.
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
        {(['all', 'pending', 'completed', 'cancelled'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              statusFilter === status
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {status === 'all' ? 'Alle' : getStatusLabel(status)}
            <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-700">
              {statusCounts[status]}
            </span>
          </button>
        ))}
      </div>

      {/* Purchases List */}
      {filteredPurchases.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
          <Package className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
          <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">
            {statusFilter === 'all' ? 'Keine Käufe vorhanden' : `Keine ${getStatusLabel(statusFilter).toLowerCase()}en Käufe`}
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {statusFilter === 'all'
              ? 'Sie haben noch keine Produkte gekauft.'
              : `Keine Käufe in dieser Kategorie.`}
          </p>
          {statusFilter === 'all' && (
            <button
              onClick={() => navigate('/marketplace/search')}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
            >
              <Package className="h-4 w-4" />
              Zum Katalog
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPurchases.map((purchase) => (
            <div
              key={purchase.id}
              className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <img
                    src={purchase.productImage}
                    alt={purchase.productTitle}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                </div>

                {/* Purchase Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {purchase.productTitle}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Verkäufer: {purchase.sellerName}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Kaufdatum: {purchase.purchasedAt.toLocaleDateString('de-AT')}
                      </p>
                      {purchase.purchaseType === 'offer_accepted' && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                          Gekauft über Gegenangebot
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600 dark:text-red-400">
                        {purchase.priceAtPurchase.toLocaleString('de-AT')} €
                      </p>
                      <span className={`inline-block mt-2 rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(purchase.status)}`}>
                        {getStatusLabel(purchase.status)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {purchase.status === 'pending' && (
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => navigate(`/marketplace/product/${purchase.productId}`)}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                      >
                        Produktdetails
                      </button>
                      <button
                        onClick={() => navigate(`/marketplace/product/${purchase.productId}?openChat=true`)}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Mit Verkäufer kontaktieren
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

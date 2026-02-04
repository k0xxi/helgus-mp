import { useEffect } from 'react'
import { Heart, Loader2, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useFavoriteProducts } from '@/hooks/useFavoriteProducts'
import { useFavorites } from '@/hooks/useFavorites'
import { ProductCard } from '@/sections/produktkatalog-suche/components/ProductCard'

export function FavoritesPage() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  // Fetch favorite products and favorites hook for managing them
  const { products, loading: productsLoading, error: productsError, refetch } = useFavoriteProducts(user?.id)
  const { toggleFavorite } = useFavorites(user?.id)

  // Handle removing a favorite
  const handleRemoveFavorite = async (productId: string) => {
    const { error } = await toggleFavorite(productId)
    if (!error) {
      // Refetch the favorites list to remove the product immediately
      await refetch()
    }
  }

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth')
    }
  }, [user, authLoading, navigate])

  // Show loading state while auth is being resolved
  if (authLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-slate-800 dark:to-slate-900 rounded-lg px-6 py-8 border border-red-100 dark:border-red-900/30">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-5 w-5 text-red-600 dark:text-red-500" />
            <span className="text-sm font-semibold text-red-600 dark:text-red-500">Meine Favoriten</span>
          </div>
          <div className="mb-3">
            <h1 className="text-[2rem] font-bold text-slate-900 dark:text-white">
              Meine <span className="text-red-600 dark:text-red-500">Favoriten</span>
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
            Speichern Sie Ihre Lieblingsar­tikel, um sie später schnell zu finden.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-400">Wird geladen...</p>
        </div>
      </div>
    )
  }

  // Only render if user is authenticated
  if (!user) {
    return null
  }

  // Show error state if something went wrong fetching favorites
  if (productsError) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-slate-800 dark:to-slate-900 rounded-lg px-6 py-8 border border-red-100 dark:border-red-900/30">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-5 w-5 text-red-600 dark:text-red-500" />
            <span className="text-sm font-semibold text-red-600 dark:text-red-500">Meine Favoriten</span>
          </div>
          <div className="mb-3">
            <h1 className="text-[2rem] font-bold text-slate-900 dark:text-white">
              Meine <span className="text-red-600 dark:text-red-500">Favoriten</span>
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
            Speichern Sie Ihre Lieblingsar­tikel, um sie später schnell zu finden.
          </p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/10">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-300">Fehler beim Laden</h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                {productsError.message}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state while products are loading
  if (productsLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-slate-800 dark:to-slate-900 rounded-lg px-6 py-8 border border-red-100 dark:border-red-900/30">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-5 w-5 text-red-600 dark:text-red-500" />
            <span className="text-sm font-semibold text-red-600 dark:text-red-500">Meine Favoriten</span>
          </div>
          <div className="mb-3">
            <h1 className="text-[2rem] font-bold text-slate-900 dark:text-white">
              Meine <span className="text-red-600 dark:text-red-500">Favoriten</span>
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
            Speichern Sie Ihre Lieblingsar­tikel, um sie später schnell zu finden.
          </p>
        </div>
        <div className="flex items-center justify-center rounded-lg border border-slate-200 bg-white p-12 dark:border-slate-700 dark:bg-slate-800">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      </div>
    )
  }

  // Show empty state if no favorites
  if (products.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-slate-800 dark:to-slate-900 rounded-lg px-6 py-8 border border-red-100 dark:border-red-900/30">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-5 w-5 text-red-600 dark:text-red-500" />
            <span className="text-sm font-semibold text-red-600 dark:text-red-500">Meine Favoriten</span>
          </div>
          <div className="mb-3">
            <h1 className="text-[2rem] font-bold text-slate-900 dark:text-white">
              Meine <span className="text-red-600 dark:text-red-500">Favoriten</span>
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
            Speichern Sie Ihre Lieblingsar­tikel, um sie später schnell zu finden.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
          <Heart className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
          <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">
            Keine Favoriten
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Sie haben noch keine Artikel als Favoriten gespeichert.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-slate-800 dark:to-slate-900 rounded-lg px-6 py-8 border border-red-100 dark:border-red-900/30">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="h-5 w-5 text-red-600 dark:text-red-500" />
          <span className="text-sm font-semibold text-red-600 dark:text-red-400">Meine Favoriten</span>
        </div>
        <div className="mb-3">
          <h1 className="text-[2rem] font-bold text-slate-900 dark:text-white">
            Meine <span className="text-red-600 dark:text-red-500">Favoriten</span>
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
          {products.length === 0
            ? 'Speichern Sie Ihre Lieblingsar­tikel, um sie später schnell zu finden.'
            : `Sie haben ${products.length} Artikel als Favoriten gespeichert. Durchstöbern Sie Ihre Sammlung.`}
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onView={() => navigate(`/product/${product.id}`)}
            onToggleFavorite={() => handleRemoveFavorite(product.id)}
          />
        ))}
      </div>
    </div>
  )
}

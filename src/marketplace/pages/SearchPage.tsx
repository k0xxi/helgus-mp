import { useState, useCallback, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { ProductCatalog } from '@/sections/produktkatalog-suche/components/ProductCatalog'
import { useProducts, useCategories, useDeleteProduct } from '@/marketplace/hooks/useProducts'
import { useCategoriesWithCounts } from '@/marketplace/hooks/useCategoriesWithCounts'
import { useFavorites } from '@/marketplace/hooks/useFavorites'
import { useAuth } from '@/marketplace/context/AuthContext'
import type { ProductFilters, SortOption } from '@/../product/sections/produktkatalog-suche/types'

export function SearchPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()
  const [deleteModalProductId, setDeleteModalProductId] = useState<string | null>(null)

  // Parse filters from URL
  const filters: ProductFilters = useMemo(
    () => ({
      searchQuery: searchParams.get('q') || undefined,
      category: searchParams.get('category') || undefined,
      subcategory: searchParams.get('subcategory') || undefined,
      priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
      priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
      zipCode: searchParams.get('zipCode') || undefined,
      radius: searchParams.get('radius')
        ? (Number(searchParams.get('radius')) as 10 | 25 | 50 | 100 | 200)
        : undefined,
      deliveryOption:
        (searchParams.get('deliveryOption') as 'alle' | 'abholung' | 'versand') || undefined,
      condition:
        (searchParams.get('condition') as
          | 'alle'
          | 'neu'
          | 'wie-neu'
          | 'sehr-gut'
          | 'gut'
          | 'akzeptabel') || undefined,
    }),
    [searchParams]
  )

  const sortBy: SortOption = (searchParams.get('sort') as SortOption) || 'newest'

  // Fetch favorites
  const { favoriteIds, toggleFavorite } = useFavorites(user?.id)

  // Fetch categories with product counts
  const { categories, loading: categoriesLoading } = useCategoriesWithCounts()

  // Fetch products
  const {
    products,
    loading: productsLoading,
    error: productsError,
    refetch,
  } = useProducts(filters, sortBy, user?.id, favoriteIds)

  // Delete product hook
  const { deleteProduct, deleting } = useDeleteProduct()

  // Update URL with new filters
  const handleApplyFilters = useCallback(
    (newFilters: ProductFilters) => {
      const params = new URLSearchParams()

      if (newFilters.searchQuery) params.set('q', newFilters.searchQuery)
      if (newFilters.category) params.set('category', newFilters.category)
      if (newFilters.subcategory) params.set('subcategory', newFilters.subcategory)
      if (newFilters.priceMin !== undefined) params.set('priceMin', String(newFilters.priceMin))
      if (newFilters.priceMax !== undefined) params.set('priceMax', String(newFilters.priceMax))
      if (newFilters.zipCode) params.set('zipCode', newFilters.zipCode)
      if (newFilters.radius) params.set('radius', String(newFilters.radius))
      if (newFilters.deliveryOption && newFilters.deliveryOption !== 'alle') {
        params.set('deliveryOption', newFilters.deliveryOption)
      }
      if (newFilters.condition && newFilters.condition !== 'alle') {
        params.set('condition', newFilters.condition)
      }

      // Preserve sort
      const currentSort = searchParams.get('sort')
      if (currentSort) params.set('sort', currentSort)

      setSearchParams(params)
    },
    [searchParams, setSearchParams]
  )

  // Reset all filters
  const handleResetFilters = useCallback(() => {
    const params = new URLSearchParams()
    // Preserve sort
    const currentSort = searchParams.get('sort')
    if (currentSort) params.set('sort', currentSort)
    setSearchParams(params)
  }, [searchParams, setSearchParams])

  // Handle sort change
  const handleSortChange = useCallback(
    (newSort: SortOption) => {
      const params = new URLSearchParams(searchParams)
      params.set('sort', newSort)
      setSearchParams(params)
    },
    [searchParams, setSearchParams]
  )

  // Navigate to product detail
  const handleViewProduct = useCallback(
    (productId: string) => {
      navigate(`/marketplace/product/${productId}`)
    },
    [navigate]
  )

  // Toggle favorite
  const handleToggleFavorite = useCallback(
    async (productId: string) => {
      if (!user) {
        // Redirect to login if not authenticated
        navigate('/marketplace/auth')
        return
      }
      const { error } = await toggleFavorite(productId)
      if (error) {
        console.error('Error toggling favorite:', error)
      }
    },
    [user, navigate, toggleFavorite]
  )

  // Navigate to edit product
  const handleEditProduct = useCallback(
    (productId: string) => {
      navigate(`/marketplace/sell?edit=${productId}`)
    },
    [navigate]
  )

  // Show delete confirmation
  const handleDeleteProduct = useCallback((productId: string) => {
    setDeleteModalProductId(productId)
  }, [])

  // Confirm delete
  const handleConfirmDelete = useCallback(async () => {
    if (!deleteModalProductId) return

    const { error } = await deleteProduct(deleteModalProductId)
    if (error) {
      console.error('Error deleting product:', error)
    } else {
      await refetch()
    }
    setDeleteModalProductId(null)
  }, [deleteModalProductId, deleteProduct, refetch])

  // Cancel delete
  const handleCancelDelete = useCallback(() => {
    setDeleteModalProductId(null)
  }, [])

  const loading = productsLoading || categoriesLoading

  return (
    <div className="min-h-screen">
      {/* Error state */}
      {productsError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 p-6 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="mt-4 font-semibold text-red-800 dark:text-red-200">
              Fehler beim Laden der Produkte
            </h2>
            <p className="mt-2 text-sm text-red-600 dark:text-red-300">{productsError.message}</p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Erneut versuchen
            </button>
          </div>
        </div>
      )}

      {/* Loading state for initial load */}
      {loading && products.length === 0 && !productsError && (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
          {/* Hero placeholder */}
          <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-slate-800 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="h-6 w-40 bg-red-100 dark:bg-red-900/30 rounded-full mb-4 animate-pulse" />
              <div className="h-12 w-64 bg-slate-200 dark:bg-slate-700 rounded mb-4 animate-pulse" />
              <div className="h-6 w-96 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            </div>
          </div>
          {/* Content placeholder */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <aside className="hidden lg:block lg:w-80 flex-shrink-0">
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 h-96 animate-pulse" />
              </aside>
              <main className="flex-1">
                <div className="flex items-center justify-center py-24">
                  <Loader2 className="h-8 w-8 text-red-500 animate-spin" />
                  <span className="ml-3 text-slate-600 dark:text-slate-400">Produkte laden...</span>
                </div>
              </main>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      {!productsError && (!loading || products.length > 0) && (
        <ProductCatalog
          products={products}
          categories={categories}
          filters={filters}
          sortBy={sortBy}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          onSortChange={handleSortChange}
          onViewProduct={handleViewProduct}
          onToggleFavorite={handleToggleFavorite}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      )}

      {/* Delete confirmation modal */}
      {deleteModalProductId && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleCancelDelete}
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Produkt löschen?
                </h3>
              </div>

              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Möchten Sie dieses Produkt wirklich löschen? Diese Aktion kann nicht rückgängig
                gemacht werden.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  disabled={deleting}
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  disabled={deleting}
                >
                  {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Löschen
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

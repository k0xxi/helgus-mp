import { useState } from 'react'
import { Package, Filter, X } from 'lucide-react'
import { ProductCard } from './ProductCard'
import { FilterSidebar } from './FilterSidebar'
import type { ProductCatalogProps, SortOption } from '@/../product/sections/produktkatalog-suche/types'

export function ProductCatalog({
  products,
  categories,
  filters,
  sortBy = 'newest',
  isAuthenticated = false,
  onApplyFilters,
  onResetFilters,
  onSortChange,
  onViewProduct,
  onToggleFavorite,
  onEditProduct,
  onDeleteProduct,
}: ProductCatalogProps & { isAuthenticated?: boolean }) {
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  // Sort products based on sortBy
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  const getSortLabel = (option: SortOption): string => {
    const labels: Record<SortOption, string> = {
      newest: 'Neueste zuerst',
      'price-asc': 'Preis aufsteigend',
      'price-desc': 'Preis absteigend',
    }
    return labels[option]
  }

  return (
    <div className="space-y-6">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-slate-800 dark:to-slate-900 rounded-lg px-6 py-8 border border-red-100 dark:border-red-900/30">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-red-600 dark:text-red-500" />
              <span className="text-sm font-semibold text-red-600 dark:text-red-500">Produkte entdecken</span>
            </div>
            <div className="mb-3">
              <h1 className="text-[2rem] font-bold text-slate-900 dark:text-slate-100">
                Alle <span className="text-red-600 dark:text-red-500">Produkte</span>
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
              Durchstöbern Sie unsere große Auswahl an Produkten. Finden Sie genau das, was Sie
              suchen.
            </p>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar - Desktop */}
          <aside className="hidden lg:block lg:w-80 flex-shrink-0">
            <FilterSidebar
              categories={categories}
              filters={filters}
              onApplyFilters={onApplyFilters}
              onResetFilters={onResetFilters}
            />
          </aside>

          {/* Mobile Filter Modal */}
          {showMobileFilter && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setShowMobileFilter(false)}
              />

              {/* Filter Panel */}
              <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white dark:bg-slate-900 z-50 overflow-y-auto lg:hidden">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 py-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Filter
                  </h2>
                  <button
                    onClick={() => setShowMobileFilter(false)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    aria-label="Filter schließen"
                  >
                    <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                  </button>
                </div>

                {/* Filter Content */}
                <div className="p-4">
                  <FilterSidebar
                    categories={categories}
                    filters={filters}
                    onApplyFilters={(filters) => {
                      onApplyFilters?.(filters)
                      setShowMobileFilter(false)
                    }}
                    onResetFilters={() => {
                      onResetFilters?.()
                      setShowMobileFilter(false)
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {/* Products Grid */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <p className="text-slate-600 dark:text-slate-400">
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {sortedProducts.length}
                </span>{' '}
                Produkte gefunden
              </p>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowMobileFilter(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex-1 sm:flex-initial justify-center"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                  <label className="text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    Sortieren:
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => onSortChange?.(e.target.value as SortOption)}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent w-full"
                  >
                    <option value="newest">{getSortLabel('newest')}</option>
                    <option value="price-asc">{getSortLabel('price-asc')}</option>
                    <option value="price-desc">{getSortLabel('price-desc')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isAuthenticated={isAuthenticated}
                    onView={() => onViewProduct?.(product.id)}
                    onToggleFavorite={() => onToggleFavorite?.(product.id)}
                    onEdit={() => onEditProduct?.(product.id)}
                    onDelete={() => onDeleteProduct?.(product.id)}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                  <Package className="w-12 h-12 text-slate-400 dark:text-slate-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Keine Produkte gefunden
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-center max-w-md mb-6">
                  Versuchen Sie andere Filter oder erweitern Sie den Suchradius, um mehr Ergebnisse
                  zu finden.
                </p>
                {onResetFilters && (
                  <button
                    onClick={onResetFilters}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-bold rounded-lg transition-colors"
                  >
                    Filter zurücksetzen
                  </button>
                )}
              </div>
            )}
          </main>
          </div>
    </div>
  )
}

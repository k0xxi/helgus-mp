import { useState } from 'react'
import type { ListingsGridProps, ProductStatus } from '../types'
import { ListingCard } from './ListingCard'

// Icons
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  )
}

function FunnelIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
    </svg>
  )
}

function PackageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
    </svg>
  )
}

type FilterStatus = 'alle' | ProductStatus

const statusFilters: { value: FilterStatus; label: string }[] = [
  { value: 'alle', label: 'Alle' },
  { value: 'aktiv', label: 'Aktiv' },
  { value: 'pausiert', label: 'Pausiert' },
  { value: 'verkauft', label: 'Verkauft' },
  { value: 'abgelaufen', label: 'Abgelaufen' }
]

export function ListingsGrid({
  products,
  onView,
  onEdit,
  onDelete,
  onTogglePause,
  onMarkAsSold,
  onCreate
}: ListingsGridProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('alle')

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'alle' || product.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Count by status
  const statusCounts = {
    alle: products.length,
    aktiv: products.filter(p => p.status === 'aktiv').length,
    pausiert: products.filter(p => p.status === 'pausiert').length,
    verkauft: products.filter(p => p.status === 'verkauft').length,
    abgelaufen: products.filter(p => p.status === 'abgelaufen').length
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <GridIcon className="w-7 h-7 text-slate-400" />
              Meine Anzeigen
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {products.length} Anzeige{products.length !== 1 ? 'n' : ''} insgesamt
            </p>
          </div>

          <button
            onClick={onCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-xl shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all"
          >
            <PlusIcon className="w-5 h-5" />
            Neue Anzeige
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Anzeigen durchsuchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-700 rounded-xl overflow-x-auto">
              {statusFilters.map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                    statusFilter === filter.value
                      ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {filter.label}
                  <span className={`px-1.5 py-0.5 text-xs rounded-md ${
                    statusFilter === filter.value
                      ? 'bg-slate-100 dark:bg-slate-500 text-slate-600 dark:text-slate-200'
                      : 'bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400'
                  }`}>
                    {statusCounts[filter.value]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ListingCard
                key={product.id}
                product={product}
                onView={() => onView?.(product.id)}
                onEdit={() => onEdit?.(product.id)}
                onDelete={() => onDelete?.(product.id)}
                onTogglePause={() => onTogglePause?.(product.id)}
                onMarkAsSold={() => onMarkAsSold?.(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
              <PackageIcon className="w-8 h-8 text-slate-400" />
            </div>
            {searchQuery || statusFilter !== 'alle' ? (
              <>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Keine Anzeigen gefunden
                </h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                  Versuche andere Suchbegriffe oder Filter.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setStatusFilter('alle')
                  }}
                  className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                >
                  Filter zurücksetzen
                </button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Noch keine Anzeigen
                </h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                  Erstelle deine erste Anzeige und beginne mit dem Verkaufen.
                </p>
                <button
                  onClick={onCreate}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                  Erste Anzeige erstellen
                </button>
              </>
            )}
          </div>
        )}

        {/* Summary Footer */}
        {products.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {statusCounts.aktiv} aktiv
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                {statusCounts.pausiert} pausiert
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                {statusCounts.verkauft} verkauft
              </span>
              {statusCounts.abgelaufen > 0 && (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  {statusCounts.abgelaufen} abgelaufen
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

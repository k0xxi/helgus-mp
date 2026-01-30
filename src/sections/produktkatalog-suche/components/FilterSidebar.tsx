import React, { useState } from 'react'
import { Filter, RotateCcw } from 'lucide-react'
import type { ProductFilters, Category } from '@/../product/sections/produktkatalog-suche/types'

interface FilterSidebarProps {
  categories: Category[]
  filters?: ProductFilters
  onApplyFilters?: (filters: ProductFilters) => void
  onResetFilters?: () => void
}

export function FilterSidebar({
  categories,
  filters: initialFilters,
  onApplyFilters,
  onResetFilters,
}: FilterSidebarProps) {
  const [filters, setFilters] = useState<ProductFilters>(initialFilters || {})

  const handleApply = () => {
    onApplyFilters?.(filters)
  }

  const handleReset = () => {
    setFilters({})
    onResetFilters?.()
  }

  const updateFilter = (key: keyof ProductFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  // Get subcategories for selected category
  const getSubcategories = () => {
    if (!filters.category) return []
    const category = categories.find((cat) => cat.name === filters.category)
    return category?.subcategories || []
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 sticky top-20">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-['DM_Sans']">
          Filter
        </h2>
      </div>

      <div className="space-y-6">
        {/* Search Query */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 font-['DM_Sans']">
            Was suchst du?
          </label>
          <input
            type="text"
            placeholder="Produktname..."
            value={filters.searchQuery || ''}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent font-['Inter']"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 font-['DM_Sans']">
            Kategorie
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => {
              updateFilter('category', e.target.value)
              updateFilter('subcategory', '') // Reset subcategory
            }}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent font-['Inter']"
          >
            <option value="">Alle Kategorien</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory (only if category selected) */}
        {filters.category && getSubcategories().length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 font-['DM_Sans']">
              Unterkategorie
            </label>
            <select
              value={filters.subcategory || ''}
              onChange={(e) => updateFilter('subcategory', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent font-['Inter']"
            >
              <option value="">Alle</option>
              {getSubcategories().map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 font-['DM_Sans']">
            Preis
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="Von"
              value={filters.priceMin || ''}
              onChange={(e) => updateFilter('priceMin', e.target.value ? Number(e.target.value) : undefined)}
              className="w-0 flex-1 min-w-0 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent font-['Inter']"
            />
            <span className="text-slate-400 dark:text-slate-500">-</span>
            <input
              type="number"
              placeholder="Bis"
              value={filters.priceMax || ''}
              onChange={(e) => updateFilter('priceMax', e.target.value ? Number(e.target.value) : undefined)}
              className="w-0 flex-1 min-w-0 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent font-['Inter']"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 font-['DM_Sans']">
            Standort
          </label>
          <input
            type="text"
            placeholder="PLZ"
            value={filters.zipCode || ''}
            onChange={(e) => updateFilter('zipCode', e.target.value)}
            className="w-full mb-2 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent font-['Inter']"
          />
          <select
            value={filters.radius || ''}
            onChange={(e) => updateFilter('radius', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent font-['Inter']"
          >
            <option value="">+ Umkreis wählen</option>
            <option value="10">+ 10 km Umkreis</option>
            <option value="25">+ 25 km Umkreis</option>
            <option value="50">+ 50 km Umkreis</option>
            <option value="100">+ 100 km Umkreis</option>
            <option value="200">+ 200 km Umkreis</option>
          </select>
        </div>

        {/* Delivery Option */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 font-['DM_Sans']">
            Abholungsart
          </label>
          <select
            value={filters.deliveryOption || 'alle'}
            onChange={(e) => updateFilter('deliveryOption', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent font-['Inter']"
          >
            <option value="alle">Alle</option>
            <option value="abholung">Nur Abholung</option>
            <option value="versand">Nur Versand</option>
          </select>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 font-['DM_Sans']">
            Zustand
          </label>
          <select
            value={filters.condition || 'alle'}
            onChange={(e) => updateFilter('condition', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent font-['Inter']"
          >
            <option value="alle">Alle</option>
            <option value="neu">Neu</option>
            <option value="wie-neu">Wie neu</option>
            <option value="sehr-gut">Sehr gut</option>
            <option value="gut">Gut</option>
            <option value="akzeptabel">Akzeptabel</option>
          </select>
        </div>

        {/* Apply Button */}
        <button
          onClick={handleApply}
          className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-colors font-['DM_Sans']"
        >
          Filter anwenden
        </button>

        {/* Reset Link */}
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors font-['Inter']"
        >
          <RotateCcw className="w-4 h-4" />
          Filter zurücksetzen
        </button>
      </div>
    </div>
  )
}

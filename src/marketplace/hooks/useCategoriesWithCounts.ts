import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Tables } from '@/types/database'

export interface CategoryWithCount extends Tables<'categories'> {
  productCount: number
}

interface UseCategoriesWithCountsResult {
  categories: CategoryWithCount[]
  loading: boolean
  error: Error | null
}

export function useCategoriesWithCounts(): UseCategoriesWithCountsResult {
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchCategoriesWithCounts() {
      try {
        // OPTIMIZED: Fetch all categories in 1 query
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .is('parent_id', null)
          .order('sort_order')

        if (categoriesError) {
          throw categoriesError
        }

        // OPTIMIZED: Fetch ALL products that match criteria in 1 query (not per category)
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('id, category_id')
          .eq('is_active', true)
          .is('sold_at', null)
          .is('pending_since', null)

        if (productsError) {
          throw productsError
        }

        // OPTIMIZED: Count products per category in JavaScript (O(n) instead of N+1 queries)
        const productsByCategory = new Map<string, number>()
        if (productsData) {
          for (const product of productsData) {
            const count = productsByCategory.get(product.category_id) || 0
            productsByCategory.set(product.category_id, count + 1)
          }
        }

        // Combine categories with their product counts
        const categoriesWithCounts = (categoriesData || []).map((category) => ({
          ...category,
          productCount: productsByCategory.get(category.id) || 0,
        }))

        setCategories(categoriesWithCounts)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategoriesWithCounts()
  }, [])

  return { categories, loading, error }
}

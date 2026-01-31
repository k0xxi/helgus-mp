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
        // Fetch all categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .is('parent_id', null)
          .order('sort_order')

        if (categoriesError) {
          throw categoriesError
        }

        // Fetch product counts for each category
        const categoriesWithCounts = await Promise.all(
          (categoriesData || []).map(async (category) => {
            const { count, error: countError } = await supabase
              .from('products')
              .select('id', { count: 'exact', head: true })
              .eq('category_id', category.id)
              .eq('is_active', true)

            return {
              ...category,
              productCount: countError ? 0 : (count || 0),
            }
          })
        )

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

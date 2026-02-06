import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Tables } from '@/types/database'

export interface CategoryWithCount extends Tables<'categories'> {
  productCount: number
  subcategories: { id: string; name: string; slug: string }[]
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
        // Fetch ALL categories (parents + children) in 1 query
        const { data: allCategoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order')

        if (categoriesError) {
          throw categoriesError
        }

        const allCategories = allCategoriesData || []
        const parentCategories = allCategories.filter(c => !c.parent_id)
        const childCategories = allCategories.filter(c => c.parent_id)

        // Build a map: parent_id → [child_ids]
        const childIdsByParent = new Map<string, string[]>()
        for (const child of childCategories) {
          const existing = childIdsByParent.get(child.parent_id!) || []
          existing.push(child.id)
          childIdsByParent.set(child.parent_id!, existing)
        }

        // Fetch ALL active products' category_ids in 1 query
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('id, category_id')
          .eq('is_active', true)
          .is('sold_at', null)
          .is('pending_since', null)

        if (productsError) {
          throw productsError
        }

        // Count products per category_id
        const productsByCategory = new Map<string, number>()
        if (productsData) {
          for (const product of productsData) {
            const count = productsByCategory.get(product.category_id) || 0
            productsByCategory.set(product.category_id, count + 1)
          }
        }

        // For each parent, sum up counts from all its children + direct assignments
        const categoriesWithCounts = parentCategories.map((category) => {
          const childIds = childIdsByParent.get(category.id) || []
          let totalCount = productsByCategory.get(category.id) || 0
          for (const childId of childIds) {
            totalCount += productsByCategory.get(childId) || 0
          }
          // Get subcategories for this parent
          const subs = childCategories
            .filter(c => c.parent_id === category.id)
            .map(c => ({ id: c.id, name: c.name, slug: c.slug }))

          return {
            ...category,
            productCount: totalCount,
            subcategories: subs,
          }
        })

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

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Tables } from '@/types/database'

// =============================================================================
// useFavorites - Manage user favorites
// =============================================================================

interface UseFavoritesResult {
  favoriteIds: Set<string>
  loading: boolean
  error: Error | null
  toggleFavorite: (productId: string) => Promise<{ error: Error | null }>
  isFavorited: (productId: string) => boolean
  refetch: () => Promise<void>
}

export function useFavorites(userId: string | undefined): UseFavoritesResult {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchFavorites = useCallback(async () => {
    if (!userId) {
      setFavoriteIds(new Set())
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', userId)

      if (fetchError) {
        throw fetchError
      }

      const favorites = (data || []) as Pick<Tables<'favorites'>, 'product_id'>[]
      const ids = new Set(favorites.map((fav) => fav.product_id))
      setFavoriteIds(ids)
    } catch (err) {
      setError(err as Error)
      setFavoriteIds(new Set())
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  const toggleFavorite = async (productId: string): Promise<{ error: Error | null }> => {
    if (!userId) {
      return { error: new Error('Bitte melden Sie sich an, um Favoriten zu speichern.') }
    }

    try {
      const isFav = favoriteIds.has(productId)

      if (isFav) {
        // Remove from favorites
        const { error: deleteError } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', productId)

        if (deleteError) {
          throw deleteError
        }

        // Update local state optimistically
        setFavoriteIds((prev) => {
          const next = new Set(prev)
          next.delete(productId)
          return next
        })
      } else {
        // Add to favorites
        const insertData = {
          user_id: userId,
          product_id: productId,
        }
        const { error: insertError } = await supabase
          .from('favorites')
          .insert(insertData as never)

        if (insertError) {
          throw insertError
        }

        // Update local state optimistically
        setFavoriteIds((prev) => {
          const next = new Set(prev)
          next.add(productId)
          return next
        })
      }

      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }

  const isFavorited = (productId: string): boolean => {
    return favoriteIds.has(productId)
  }

  return {
    favoriteIds,
    loading,
    error,
    toggleFavorite,
    isFavorited,
    refetch: fetchFavorites,
  }
}

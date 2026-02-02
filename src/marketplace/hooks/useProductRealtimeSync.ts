import { useEffect, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useRealtimeSubscription } from './useRealtimeSubscription'
import { queryKeys } from './useQueryHooks'
import type { Tables } from '@/types/database'

/**
 * Hook that subscribes to product changes and invalidates React Query cache
 * This keeps the product list and details in sync with database changes
 */
export function useProductRealtimeSync() {
  const queryClient = useQueryClient()

  const handleProductChange = useCallback(
    (event: {
      type: 'INSERT' | 'UPDATE' | 'DELETE'
      new?: Partial<Tables<'products'>>
      old?: Partial<Tables<'products'>>
    }) => {
      // Invalidate all product-related queries to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.all,
      })

      // If specific product changed, invalidate its details
      if (event.new?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.products.detail(event.new.id as string),
        })
      }

      console.log(`[Realtime] Product ${event.type}:`, event.new?.id || event.old?.id)
    },
    [queryClient]
  )

  const { isConnected, error } = useRealtimeSubscription('products', handleProductChange)

  return { isConnected, error }
}

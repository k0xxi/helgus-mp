import { useEffect, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useRealtimeSubscription } from './useRealtimeSubscription'
import { queryKeys } from './useQueryHooks'
import type { Tables } from '@/types/database'

/**
 * Hook that subscribes to profile changes and invalidates React Query cache
 * Keeps user profile data in sync with any changes
 */
export function useProfileRealtimeSync() {
  const queryClient = useQueryClient()

  const handleProfileChange = useCallback(
    (event: {
      type: 'INSERT' | 'UPDATE' | 'DELETE'
      new?: Partial<Tables<'profiles'>>
      old?: Partial<Tables<'profiles'>>
    }) => {
      // If a profile was updated, invalidate its data
      if (event.new?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.profiles.detail(event.new.id as string),
        })
      }
    },
    [queryClient]
  )

  const { isConnected, error } = useRealtimeSubscription('profiles', handleProfileChange)

  return { isConnected, error }
}

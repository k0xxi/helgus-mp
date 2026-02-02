import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

/**
 * Generic hook for subscribing to realtime changes on any table
 * Usage: useRealtimeSubscription('products', onChanges)
 */
export function useRealtimeSubscription<T>(
  tableName: string,
  onEvent?: (event: {
    type: 'INSERT' | 'UPDATE' | 'DELETE'
    new?: T
    old?: T
  }) => void
) {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let channel: RealtimeChannel | null = null

    const subscribe = async () => {
      try {
        channel = supabase
          .channel(`public:${tableName}`)
          .on(
            'postgres_changes',
            {
              event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
              schema: 'public',
              table: tableName,
            },
            (payload) => {
              onEvent?.({
                type: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
                new: payload.new as T,
                old: payload.old as T,
              })
            }
          )
          .subscribe((status) => {
            setIsConnected(status === 'SUBSCRIBED')
          })
      } catch (err) {
        setError(err as Error)
        setIsConnected(false)
      }
    }

    subscribe()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [tableName, onEvent])

  return { isConnected, error }
}

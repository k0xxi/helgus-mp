import { useEffect, useRef } from 'react'

/**
 * Global hook that auto-refetches data on window focus and periodically
 * Use this in any component with custom useEffect data fetching
 *
 * @param refetchFn - Async function to call for refetching
 * @param pollingInterval - How often to poll in milliseconds (default: 12 seconds)
 *
 * @example
 * function MyComponent() {
 *   const [data, setData] = useState(null)
 *
 *   const fetchData = useCallback(async () => {
 *     const { data } = await supabase.from('table').select()
 *     setData(data)
 *   }, [])
 *
 *   // Auto-refetch on window focus and every 12 seconds
 *   useAutoRefetch(fetchData, 1000 * 12)
 *
 *   return <div>{data}</div>
 * }
 */
export function useAutoRefetch(
  refetchFn: () => Promise<void> | void,
  pollingInterval: number = 1000 * 12 // Default: 12 seconds
) {
  const refetchFnRef = useRef(refetchFn)
  refetchFnRef.current = refetchFn

  useEffect(() => {
    // Handle window focus event
    const handleFocus = () => {
      console.log('[AutoRefetch] Window focused, triggering refetch...')
      refetchFnRef.current()
    }

    // Handle page visibility change (tab switch, etc)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('[AutoRefetch] Page became visible, triggering refetch...')
        refetchFnRef.current()
      }
    }

    // Setup periodic polling
    const pollInterval = setInterval(() => {
      refetchFnRef.current()
    }, pollingInterval)

    // Add event listeners
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup
    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearInterval(pollInterval)
    }
  }, [pollingInterval])
}

/**
 * Hook to handle reconnection and refetch
 * Call this once per page/component tree
 *
 * @param refetchFn - Async function to call when reconnecting
 *
 * @example
 * function App() {
 *   const { refetch } = useConversationsQuery(userId)
 *   useAutoReconnect(refetch)
 *   // ...
 * }
 */
export function useAutoReconnect(refetchFn: () => Promise<void> | void) {
  const refetchFnRef = useRef(refetchFn)
  refetchFnRef.current = refetchFn

  useEffect(() => {
    const handleOnline = () => {
      console.log('[AutoReconnect] Internet reconnected, triggering refetch...')
      refetchFnRef.current()
    }

    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('online', handleOnline)
    }
  }, [])
}

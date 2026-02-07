import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import './index.css'
import { router } from '@/lib/router'
import { AuthProvider } from '@/marketplace/context/AuthContext'
import { AppPreloader } from '@/components/AppPreloader'
import { supabase } from '@/lib/supabase'

// Create a client for React Query with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ============================================================================
      // CACHE STRATEGY: Aggressive refresh for real-time marketplace experience
      // ============================================================================
      staleTime: 0, // Data is ALWAYS stale - refetch immediately
      gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes (memory management)

      // ============================================================================
      // RETRY STRATEGY: Smart retries with exponential backoff
      // ============================================================================
      retry: (failureCount, error) => {
        // Don't retry auth errors (401/403)
        const errorMessage = error?.message || String(error)
        if (errorMessage.includes('401') || errorMessage.includes('403')) {
          return false
        }
        // Retry up to 2 times for network errors
        return failureCount < 2
      },
      retryDelay: (attemptIndex) => {
        // Exponential backoff: 1s, 2s, 3s max
        return Math.min(1000 * 2 ** attemptIndex, 3000)
      },

      // ============================================================================
      // AUTO-REFETCH TRIGGERS: Data updates automatically without user action
      // ============================================================================
      refetchOnMount: true, // Refetch when component mounts
      refetchOnWindowFocus: true, // Refetch when window regains focus (tab switch, alt-tab)
      refetchOnReconnect: true, // Refetch when internet reconnects
      // NOTE: NO refetchInterval here to avoid hanging from constant polling
      // Individual hooks can override this if needed for specific use cases

      // ============================================================================
      // GLOBAL ERROR HANDLER: Session expiration fallback
      // ============================================================================
      onError: async (error) => {
        const errorMessage = error?.message || String(error)

        // Check if it's a session expiration error (401/JWT expired)
        if (
          errorMessage.includes('JWT') ||
          errorMessage.includes('expired') ||
          errorMessage.toLowerCase().includes('401')
        ) {
          console.error('[QueryClient] Session error detected, attempting refresh...')

          const { data, error: refreshError } = await supabase.auth.refreshSession()

          if (!refreshError && data.session) {
            console.log('[QueryClient] Session refreshed via fallback, invalidating queries...')
            // Invalidate all queries to trigger refetch with new token
            queryClient.invalidateQueries()
          } else {
            console.error('[QueryClient] Session refresh failed, reloading page...')
            window.location.reload()
          }
        }
      },
    },
    mutations: {
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppPreloader>
          <RouterProvider router={router} />
        </AppPreloader>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)

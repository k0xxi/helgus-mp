import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import './index.css'
import { router } from '@/lib/router'

// Create a client for React Query with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ============================================================================
      // CACHE STRATEGY: Aggressive refresh for real-time marketplace experience
      // ============================================================================
      staleTime: 0, // Data is ALWAYS stale - refetch immediately
      gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes (memory management)
      retry: 1,

      // ============================================================================
      // AUTO-REFETCH TRIGGERS: Data updates automatically without user action
      // ============================================================================
      refetchOnMount: true, // Refetch when component mounts
      refetchOnWindowFocus: true, // Refetch when window regains focus (tab switch, alt-tab)
      refetchOnReconnect: true, // Refetch when internet reconnects
      // NOTE: NO refetchInterval here to avoid hanging from constant polling
      // Individual hooks can override this if needed for specific use cases
    },
    mutations: {
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)

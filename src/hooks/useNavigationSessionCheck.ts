import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

/**
 * Hook that checks and refreshes Supabase session on navigation after inactivity
 *
 * Prevents 401 errors when user navigates after connection issues due to inactivity.
 * Also refreshes when returning to tab after being away.
 */
export function useNavigationSessionCheck() {
  const location = useLocation()
  const lastActivityRef = useRef(Date.now())
  const isRefreshingRef = useRef(false)

  // Helper function to refresh session
  const refreshSession = async (reason: string) => {
    if (isRefreshingRef.current) {
      console.log('[SessionCheck] Already refreshing, skipping...')
      return
    }

    isRefreshingRef.current = true
    console.log(`[SessionCheck] ${reason}`)

    try {
      const { data, error } = await supabase.auth.refreshSession()

      if (error) {
        console.error('[SessionCheck] Session refresh failed:', error)
        // Session invalid - reload page to re-authenticate
        window.location.reload()
      } else {
        console.log('[SessionCheck] Session refreshed successfully')
        console.log('[SessionCheck] New token expires at:', new Date(data.session?.expires_at! * 1000))
      }
    } finally {
      isRefreshingRef.current = false
    }
  }

  // Check on navigation
  useEffect(() => {
    const checkSessionBeforeNavigation = async () => {
      const timeSinceLastActivity = Date.now() - lastActivityRef.current
      const minutesInactive = Math.floor(timeSinceLastActivity / 1000 / 60)

      console.log(`[SessionCheck] Navigation detected. Inactive for ${minutesInactive} minutes`)

      // If more than 3 minutes since last activity, refresh session
      // Lowered from 30 minutes because user reports issues after 5 minutes
      if (timeSinceLastActivity > 3 * 60 * 1000) {
        await refreshSession(`Inactivity detected (${minutesInactive} min), refreshing session before navigation...`)
      }

      lastActivityRef.current = Date.now()
    }

    checkSessionBeforeNavigation()
  }, [location.pathname])

  // Check when tab becomes visible (user returns to tab)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        const timeSinceLastActivity = Date.now() - lastActivityRef.current
        const minutesInactive = Math.floor(timeSinceLastActivity / 1000 / 60)

        console.log(`[SessionCheck] Tab became visible. Inactive for ${minutesInactive} minutes`)

        // If more than 3 minutes inactive, refresh proactively
        if (timeSinceLastActivity > 3 * 60 * 1000) {
          await refreshSession(`Tab became visible after ${minutesInactive} min inactivity, refreshing session...`)
        }

        lastActivityRef.current = Date.now()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])
}

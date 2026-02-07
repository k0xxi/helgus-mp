import { useState, useEffect } from 'react'
import { useAuth } from '@/marketplace/context/AuthContext'
import { checkSupabaseHealth } from '@/lib/supabaseHealth'

export interface AppInitializationState {
  ready: boolean
  healthCheckFailed: boolean
  authLoading: boolean
  retryCountdown: number
}

/**
 * Orchestrates app startup by running health check and waiting for auth
 *
 * Phase 1: Health Check (0-3 seconds)
 * - Verifies Supabase connectivity
 * - If fails → shows countdown, then auto-refreshes page
 *
 * Phase 2: Auth Initialization (0-5 seconds, parallel)
 * - Waits for AuthContext to finish loading
 * - Has built-in 5-second timeout protection
 *
 * Phase 3: Ready
 * - Both health check and auth complete
 * - App can render
 */
export function useAppInitialization(): AppInitializationState {
  const { loading: authLoading } = useAuth()
  const [healthCheckComplete, setHealthCheckComplete] = useState(false)
  const [healthCheckFailed, setHealthCheckFailed] = useState(false)
  const [retryCountdown, setRetryCountdown] = useState(0)
  const [minLoadingTimePassed, setMinLoadingTimePassed] = useState(false)

  // Phase 1: Health Check
  useEffect(() => {
    let isMounted = true

    const runHealthCheck = async () => {
      console.log('[AppInit] Running health check...')
      const result = await checkSupabaseHealth()

      if (!isMounted) return

      if (!result.healthy) {
        console.error('[AppInit] Health check failed, will auto-refresh')
        setHealthCheckFailed(true)
        setHealthCheckComplete(true)

        // Start countdown before refresh
        setRetryCountdown(3)
        let countdown = 3
        const countdownInterval = setInterval(() => {
          countdown -= 1
          if (!isMounted) {
            clearInterval(countdownInterval)
            return
          }
          setRetryCountdown(countdown)

          if (countdown <= 0) {
            clearInterval(countdownInterval)
            console.log('[AppInit] Auto-refreshing page...')
            window.location.reload()
          }
        }, 1000)

        return () => {
          clearInterval(countdownInterval)
        }
      } else {
        console.log('[AppInit] Health check passed')
        setHealthCheckComplete(true)
        setHealthCheckFailed(false)
      }
    }

    runHealthCheck()

    return () => {
      isMounted = false
    }
  }, [])

  // Minimum loading time (500ms to prevent flash)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadingTimePassed(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Determine if app is ready
  const ready = healthCheckComplete && !authLoading && minLoadingTimePassed && !healthCheckFailed

  useEffect(() => {
    if (ready) {
      console.log('[AppInit] App initialization complete, ready to render')
    }
  }, [ready])

  return {
    ready,
    healthCheckFailed,
    authLoading,
    retryCountdown,
  }
}

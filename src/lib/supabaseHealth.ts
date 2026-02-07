import { supabase } from './supabase'

export interface HealthCheckResult {
  healthy: boolean
  error?: Error
}

/**
 * Performs a lightweight health check on the Supabase connection
 * Uses a minimal query with 3-second timeout to fail fast
 */
export async function checkSupabaseHealth(): Promise<HealthCheckResult> {
  try {
    // Create a promise that will timeout after 3 seconds
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Health check timeout')), 3000)
    })

    // Minimal query: count profiles with limit 1
    // This is fast and doesn't load unnecessary data
    const healthCheckPromise = supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .limit(1)

    // Race between the query and timeout
    const { error } = await Promise.race([healthCheckPromise, timeoutPromise])

    if (error) {
      console.error('[HealthCheck] Database query failed:', error)
      return { healthy: false, error }
    }

    console.log('[HealthCheck] Database connection healthy')
    return { healthy: true }
  } catch (err) {
    const error = err as Error
    console.error('[HealthCheck] Health check failed:', error)
    return { healthy: false, error }
  }
}

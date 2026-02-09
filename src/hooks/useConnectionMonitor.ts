import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

const CHECK_INTERVAL_MS = 2000 // Alle 2 Sekunden prüfen
const RETRY_DELAY_MS = 1000 // Bei Fehler nach 1 Sekunde nochmal versuchen
const QUERY_TIMEOUT_MS = 3000 // Timeout pro Query
const MAX_CONSECUTIVE_FAILURES = 2 // Nach 2 Fehlern in Folge = Reload

/**
 * Globaler Connection-Monitor: prüft alle 5 Sekunden ob die DB erreichbar ist.
 * Bei 2 aufeinanderfolgenden Fehlern wird die Seite automatisch neu geladen.
 * Pausiert wenn der Tab nicht sichtbar ist.
 */
export function useConnectionMonitor() {
  const failureCountRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    let isMounted = true

    const checkConnection = async (): Promise<boolean> => {
      try {
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('timeout')), QUERY_TIMEOUT_MS)
        })

        const queryPromise = supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .limit(1)

        const { error } = await Promise.race([queryPromise, timeoutPromise])
        return !error
      } catch {
        return false
      }
    }

    const runCheck = async () => {
      // Nicht prüfen wenn Tab nicht sichtbar
      if (document.visibilityState === 'hidden') return

      const healthy = await checkConnection()

      if (!isMounted) return

      if (healthy) {
        failureCountRef.current = 0
        return
      }

      // Erster Fehler: schneller Retry nach 1 Sekunde
      failureCountRef.current++
      console.warn(`[ConnectionMonitor] Check fehlgeschlagen (${failureCountRef.current}/${MAX_CONSECUTIVE_FAILURES})`)

      if (failureCountRef.current >= MAX_CONSECUTIVE_FAILURES) {
        console.error('[ConnectionMonitor] Verbindung verloren, Seite wird neu geladen...')
        window.location.reload()
        return
      }

      // Schneller Retry
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS))
      if (!isMounted) return

      const retryHealthy = await checkConnection()
      if (!isMounted) return

      if (retryHealthy) {
        failureCountRef.current = 0
      } else {
        failureCountRef.current++
        console.error('[ConnectionMonitor] Retry fehlgeschlagen, Seite wird neu geladen...')
        window.location.reload()
      }
    }

    intervalRef.current = setInterval(runCheck, CHECK_INTERVAL_MS)

    return () => {
      isMounted = false
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])
}

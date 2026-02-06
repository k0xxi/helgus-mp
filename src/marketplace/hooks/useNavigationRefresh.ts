import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Hook that triggers a full page reload when navigating between pages.
 * Uses sessionStorage to prevent infinite reload loops:
 * 1. User navigates → pathname changes → set flag → reload
 * 2. After reload → flag matches current path → clear flag, no reload
 */
export function useNavigationRefresh() {
  const location = useLocation()
  const isFirstRender = useRef(true)

  useEffect(() => {
    // Skip the very first render (initial page load)
    if (isFirstRender.current) {
      isFirstRender.current = false
      // Clear any stale flag
      sessionStorage.removeItem('nav_reload_path')
      return
    }

    const reloadedPath = sessionStorage.getItem('nav_reload_path')

    // Already reloaded for this path → clear flag, done
    if (reloadedPath === location.pathname) {
      sessionStorage.removeItem('nav_reload_path')
      return
    }

    // Set flag and reload
    sessionStorage.setItem('nav_reload_path', location.pathname)
    window.location.reload()
  }, [location.pathname])

  return { isTransitioning: false }
}

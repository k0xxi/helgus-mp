import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Hook that triggers a full page reload when navigating between pages.
 * Uses sessionStorage to prevent infinite reload loops:
 * 1. User navigates → pathname changes → we set a flag and reload
 * 2. After reload → we detect the flag matches current path → skip reload, clear flag
 */
export function useNavigationRefresh() {
  const location = useLocation()
  const isFirstRender = useRef(true)

  useEffect(() => {
    // Skip the very first render (initial page load)
    if (isFirstRender.current) {
      isFirstRender.current = false
      // Clear any stale reload flag on first render
      sessionStorage.removeItem('nav_reload_path')
      return
    }

    const reloadedPath = sessionStorage.getItem('nav_reload_path')

    // If we just reloaded for this path, clear the flag and don't reload again
    if (reloadedPath === location.pathname) {
      sessionStorage.removeItem('nav_reload_path')
      return
    }

    // Set flag and reload
    sessionStorage.setItem('nav_reload_path', location.pathname)
    window.location.reload()
  }, [location.pathname])
}

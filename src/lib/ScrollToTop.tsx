import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollToTop component
 *
 * Scrolls to top when navigating to a different route.
 * If navigating with a hash (anchor link), scrolls to that element instead.
 *
 * Place this component in your app layout so it runs on every route change.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // If there's a hash (anchor link), scroll to that element smoothly
    if (hash) {
      const id = hash.replace('#', '')
      const element = document.getElementById(id)
      if (element) {
        // Wait for DOM to settle
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 0)
      }
    } else {
      // No hash - scroll to top instantly for normal route navigation
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}

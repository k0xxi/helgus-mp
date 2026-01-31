import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollToTop component
 *
 * Prevents automatic scroll-to-top on page navigation.
 * Only scrolls to top when an anchor link is explicitly clicked.
 *
 * Place this component in your app layout so it runs on every route change.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // If there's a hash (anchor link), scroll to that element
    if (hash) {
      const id = hash.replace('#', '')
      const element = document.getElementById(id)
      if (element) {
        // Wait for DOM to settle
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 0)
      }
    }
    // If no hash, don't scroll - keep user's current scroll position
  }, [pathname, hash])

  return null
}

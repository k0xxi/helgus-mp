import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

/**
 * Hook that invalidates all React Query caches and shows a brief
 * loading spinner when navigating between pages.
 * This ensures fresh data on every page without a full page reload.
 */
export function useNavigationRefresh() {
  const location = useLocation()
  const queryClient = useQueryClient()
  const isFirstRender = useRef(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    // Skip the very first render (initial page load)
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    // Show spinner and invalidate all caches
    setIsTransitioning(true)
    queryClient.invalidateQueries()

    // Hide spinner after 500ms
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [location.pathname, queryClient])

  return { isTransitioning }
}

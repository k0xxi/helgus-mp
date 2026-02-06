import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ScrollToTop } from '@/lib/ScrollToTop'
import { loadProductData, hasProductRoadmap } from '@/lib/product-loader'
import { getAllSectionIds } from '@/lib/section-loader'

/**
 * RootLayout
 *
 * Wraps all routes and provides:
 * - ScrollToTop behavior (prevent auto scroll, allow anchor links)
 * - Auto-reload on navigation to ensure fresh data
 */
export function RootLayout() {
  const location = useLocation()

  // Reload page on every navigation to ensure fresh data from database
  useEffect(() => {
    window.location.reload()
  }, [location.pathname])

  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  )
}

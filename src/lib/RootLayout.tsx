import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { ScrollToTop } from '@/lib/ScrollToTop'
import { loadProductData, hasProductRoadmap } from '@/lib/product-loader'
import { getAllSectionIds } from '@/lib/section-loader'

/**
 * RootLayout
 *
 * Wraps all routes and provides:
 * - ScrollToTop behavior (prevent auto scroll, allow anchor links)
 * - Auto-reload if critical loaders return empty arrays
 */
export function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  )
}

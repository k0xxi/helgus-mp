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
  useEffect(() => {
    // Check if critical data loaders are empty
    const productData = loadProductData()
    const sectionIds = getAllSectionIds()

    // Log for debugging
    console.log('[RootLayout] productData.roadmap:', productData.roadmap)
    console.log('[RootLayout] sectionIds:', sectionIds)

    // If both roadmap and sections are empty, trigger page reload
    if (!productData.roadmap && sectionIds.length === 0) {
      console.warn('[RootLayout] Critical loaders are empty, reloading page...')
      // Use setTimeout to ensure the message is logged before reload
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  }, [])

  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  )
}

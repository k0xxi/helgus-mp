import { Outlet } from 'react-router-dom'
import { ScrollToTop } from '@/lib/ScrollToTop'

/**
 * RootLayout
 *
 * Wraps all routes and provides:
 * - ScrollToTop behavior (prevent auto scroll, allow anchor links)
 */
export function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  )
}

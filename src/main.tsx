import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from '@/lib/router'
import { ScrollToTop } from '@/lib/ScrollToTop'

// Create a component that includes ScrollToTop
function RootApp() {
  return (
    <>
      <ScrollToTop />
      <RouterProvider router={router} />
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootApp />
  </StrictMode>,
)

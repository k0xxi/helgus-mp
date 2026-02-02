import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '@/marketplace/context/AuthContext'

/**
 * Hook that refreshes the auth profile when navigating to different pages.
 * This ensures that profile data is always up-to-date when visiting a new page.
 */
export function useNavigationRefresh() {
  const location = useLocation()
  const { refreshProfile, user } = useAuth()

  useEffect(() => {
    // Refresh profile data whenever the user navigates to a new page
    if (user) {
      refreshProfile()
    }
  }, [location.pathname, user, refreshProfile])
}
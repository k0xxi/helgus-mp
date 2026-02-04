import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { ListingForm } from '@/components/ListingForm'

export function SellPage() {
  const navigate = useNavigate()
  const { user, profile, loading } = useAuth()

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth')
    }
  }, [user, loading, navigate])

  // Redirect if not verified seller
  useEffect(() => {
    if (!loading && profile && !profile.isVerified) {
      navigate('/profile/verification')
    }
  }, [profile, loading, navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    )
  }

  if (!user || !profile?.isVerified) {
    return null
  }

  return <ListingForm />
}

import { useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useAuth } from '@/marketplace/context/AuthContext'
import { useNavigate } from 'react-router-dom'

export function FavoritesPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/marketplace/auth')
    }
  }, [user, loading, navigate])

  // Show loading state while auth is being resolved
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Heart className="h-6 w-6 text-red-500" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Favoriten</h1>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-400">Wird geladen...</p>
        </div>
      </div>
    )
  }

  // Only render if user is authenticated
  if (!user) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Heart className="h-6 w-6 text-red-500" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Favoriten</h1>
      </div>

      {/* Placeholder content */}
      <div className="rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
        <Heart className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
        <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">
          Keine Favoriten
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Sie haben noch keine Artikel als Favoriten gespeichert.
        </p>
      </div>
    </div>
  )
}

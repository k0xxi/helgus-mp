import { User, Settings, Package, Shield, BadgeCheck, LayoutDashboard, ShoppingCart, TrendingUp } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useProfileCounts } from '@/hooks/useProfileCounts'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export function ProfilePage() {
  const { profile, user, loading } = useAuth()
  const { listingCount, purchaseCount, salesCount } = useProfileCounts(user?.id)
  const navigate = useNavigate()

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth')
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-slate-800 dark:to-slate-900 rounded-lg px-6 py-8 border border-red-100 dark:border-red-900/30">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-red-600 dark:text-red-500" />
          <span className="text-sm font-semibold text-red-600 dark:text-red-500">Benutzerkonto</span>
        </div>
        <div className="mb-3">
          <h1 className="text-[2rem] font-bold text-slate-900 dark:text-white">
            Mein <span className="text-red-600 dark:text-red-500">Profil</span>
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
          Verwalten Sie Ihre Kontoeinstellungen, Verifizierung und persönliche Informationen.
        </p>
      </div>

      {/* Profile card */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-start gap-4">
          {profile?.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-2xl font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              {profile?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {profile?.name || 'Benutzer'}
            </h2>
            {profile?.city && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {profile.city}, {profile.country}
              </p>
            )}
            {profile?.isVerified ? (
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                <Shield className="h-3 w-3" />
                Verifiziert
              </span>
            ) : (
              <Link
                to="/profile/verification"
                className="mt-2 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600 transition-colors"
              >
                <BadgeCheck className="h-3 w-3" />
                Jetzt verifizieren
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid gap-4 md:grid-cols-2">
        {profile?.isVerified && (
          <Link
            to="/seller-dashboard"
            className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-700">
              <LayoutDashboard className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </div>
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Verkäufer-Dashboard</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Statistiken und Verkaufsaktivitäten
              </p>
            </div>
          </Link>
        )}

        <Link
          to="/my-listings"
          className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
        >
          <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-700">
            <Package className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </div>
          <div>
            <h3 className="font-medium text-slate-900 dark:text-white">
              Meine Anzeigen <span className="text-slate-500 dark:text-slate-400">({listingCount})</span>
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Ihre aktiven und verkauften Artikel
            </p>
          </div>
        </Link>

        <Link
          to="/my-purchases"
          className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
        >
          <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-700">
            <ShoppingCart className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </div>
          <div>
            <h3 className="font-medium text-slate-900 dark:text-white">
              Meine Käufe <span className="text-slate-500 dark:text-slate-400">({purchaseCount})</span>
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Ihre gekauften Artikel und Transaktionen
            </p>
          </div>
        </Link>

        {profile?.isVerified && (
          <Link
            to="/my-sales"
            className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-700">
              <TrendingUp className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </div>
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">
                Meine Verkäufe <span className="text-slate-500 dark:text-slate-400">({salesCount})</span>
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Ihre ausstehenden und abgeschlossenen Verkäufe
              </p>
            </div>
          </Link>
        )}

        <Link
          to="/profile/settings"
          className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
        >
          <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-700">
            <Settings className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </div>
          <div>
            <h3 className="font-medium text-slate-900 dark:text-white">Einstellungen</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Profil und Kontoeinstellungen bearbeiten
            </p>
          </div>
        </Link>

        {!profile?.isVerified && (
          <Link
            to="/profile/verification"
            className="flex items-center gap-4 rounded-lg border border-blue-200 bg-blue-50 p-4 transition-colors hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/20 dark:hover:bg-blue-900/30"
          >
            <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
              <BadgeCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-100">Verkäufer werden</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Verifiziere dich und schalte alle Vorteile frei
              </p>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}

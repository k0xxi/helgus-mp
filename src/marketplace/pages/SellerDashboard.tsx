import { TrendingUp, Package, MessageSquare, ShoppingCart } from 'lucide-react'
import { useAuth } from '@/marketplace/context/AuthContext'
import { useDashboardStats } from '@/marketplace/hooks/useDashboardStats'
import { SalesChart } from '@/marketplace/components/SalesChart'
import { RevenueChart } from '@/marketplace/components/RevenueChart'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export function SellerDashboard() {
  const { user, profile, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const { stats, loading: statsLoading } = useDashboardStats(user?.id)

  // Redirect if not authenticated or not verified
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/marketplace/auth')
    } else if (!authLoading && profile && !profile.isVerified) {
      navigate('/marketplace/profile')
    }
  }, [user, authLoading, profile, navigate])

  const loading = authLoading || statsLoading

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
          <TrendingUp className="h-5 w-5 text-red-600 dark:text-red-500" />
          <span className="text-sm font-semibold text-red-600 dark:text-red-500">Ihre Verkäufe</span>
        </div>
        <div className="mb-3">
          <h1 className="text-[2rem] font-bold text-slate-900 dark:text-white">
            Verkäufer-<span className="text-red-600 dark:text-red-500">Dashboard</span>
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
          Überwachen Sie Ihre Verkaufsleistung, Ansichten und Anfragen in Echtzeit.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Active Listings */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Aktive Anzeigen
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                {stats?.activeListings ?? 0}
              </p>
            </div>
            <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/20">
              <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Total Views */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Gesamtaufrufe
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                {stats?.totalViews ?? 0}
              </p>
            </div>
            <div className="rounded-lg bg-emerald-100 p-3 dark:bg-emerald-900/20">
              <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Pending Offers */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Aktive Anfragen
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                {stats?.pendingOffers ?? 0}
              </p>
            </div>
            <div className="rounded-lg bg-amber-100 p-3 dark:bg-amber-900/20">
              <MessageSquare className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        {/* Sold This Month */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Diesen Monat verkauft
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                {stats?.soldThisMonth ?? 0}
              </p>
            </div>
            <div className="rounded-lg bg-red-100 p-3 dark:bg-red-900/20">
              <ShoppingCart className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      {stats && stats.monthlySales.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <SalesChart data={stats.monthlySales} />
          <RevenueChart data={stats.monthlyRevenue} />
        </div>
      )}

      {/* Quick Actions */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
          Schnelle Aktionen
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          <a
            href="/marketplace/sell"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition-colors dark:hover:bg-blue-700"
          >
            <Package className="h-4 w-4" />
            Neues Produkt hinzufügen
          </a>
          <a
            href="/marketplace/messages"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-200 px-4 py-2 font-medium text-slate-900 hover:bg-slate-300 transition-colors dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
          >
            <MessageSquare className="h-4 w-4" />
            Nachrichten ansehen
          </a>
        </div>
      </div>
    </div>
  )
}

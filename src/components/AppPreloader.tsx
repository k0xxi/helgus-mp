import { useAppInitialization } from '@/hooks/useAppInitialization'

interface AppPreloaderProps {
  children: React.ReactNode
}

/**
 * Global app preloader that shows during initialization
 *
 * Features:
 * - Health check verification
 * - Auth loading state
 * - Auto-refresh on database connection failure
 * - Smooth fade-in/out transitions
 * - Dark mode support
 */
export function AppPreloader({ children }: AppPreloaderProps) {
  const { ready, healthCheckFailed, retryCountdown } = useAppInitialization()

  if (ready) {
    return <>{children}</>
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-slate-900 transition-opacity duration-200">
      <div className="flex flex-col items-center gap-6 px-4">
        {/* HELGUS Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-white text-xl font-bold shadow-lg">
            H
          </div>
          <span className="text-2xl font-semibold text-slate-900 dark:text-white">
            HELGUS
          </span>
        </div>

        {/* Spinner */}
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
        </div>

        {/* Loading/Error Message */}
        <div className="flex flex-col items-center gap-2">
          {healthCheckFailed ? (
            <>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 animate-pulse">
                Verbindung wird wiederhergestellt...
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Erneuter Versuch in {retryCountdown}...
              </p>
            </>
          ) : (
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 animate-pulse">
              Daten werden geladen...
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

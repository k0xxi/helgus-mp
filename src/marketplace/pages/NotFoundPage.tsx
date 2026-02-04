import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        {/* 404 Display */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-slate-900 dark:text-white md:text-8xl">
            404
          </h1>
          <div className="mt-4 h-1 w-24 bg-gradient-to-r from-red-600 to-red-500 mx-auto rounded-full" />
        </div>

        {/* Message */}
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white md:text-3xl">
          Seite nicht gefunden
        </h2>
        <p className="mt-4 text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Die angeforderte Seite existiert leider nicht oder wurde verschoben.
          Kein Problem – es gibt viel zu entdecken auf dem HELGUS Marktplatz!
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
          >
            <Home className="h-5 w-5" />
            Zur Startseite
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-900 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
          >
            <ArrowLeft className="h-5 w-5" />
            Zurück
          </button>
        </div>

        {/* Suggestions */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 max-w-md mx-auto">
          <Link
            to="/search"
            className="rounded-lg border border-slate-200 bg-white p-4 text-left transition-all hover:border-red-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-red-600"
          >
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Artikel suchen
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Durchsuchen Sie alle Angebote
            </p>
          </Link>
          <Link
            to="/profile"
            className="rounded-lg border border-slate-200 bg-white p-4 text-left transition-all hover:border-red-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-red-600"
          >
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Mein Profil
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Zu Ihrem Benutzerbereich
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}

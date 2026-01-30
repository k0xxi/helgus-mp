import { Heart } from 'lucide-react'

export function FavoritesPage() {
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

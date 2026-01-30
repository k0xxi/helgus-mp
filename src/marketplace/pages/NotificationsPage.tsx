import { Bell } from 'lucide-react'

export function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Bell className="h-6 w-6 text-amber-500" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Benachrichtigungen</h1>
      </div>

      {/* Placeholder content */}
      <div className="rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
        <Bell className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
        <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">
          Keine Benachrichtigungen
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Sie haben keine neuen Benachrichtigungen.
        </p>
      </div>
    </div>
  )
}

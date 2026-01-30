import { MessageCircle } from 'lucide-react'

export function MessagesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageCircle className="h-6 w-6 text-blue-500" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Nachrichten</h1>
      </div>

      {/* Placeholder content */}
      <div className="rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
        <MessageCircle className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
        <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">
          Keine Nachrichten
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Sie haben noch keine Unterhaltungen mit anderen Nutzern.
        </p>
      </div>
    </div>
  )
}

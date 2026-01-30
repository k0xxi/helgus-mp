import { PlusCircle } from 'lucide-react'

export function SellPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <PlusCircle className="h-6 w-6 text-green-500" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Artikel verkaufen</h1>
      </div>

      {/* Placeholder form */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Das Verkaufsformular wird hier angezeigt. Sie können Fotos hochladen, einen Titel und eine Beschreibung eingeben, den Preis festlegen und die Versandoptionen wählen.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Titel
            </label>
            <input
              type="text"
              placeholder="Was verkaufen Sie?"
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Preis
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="0,00"
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-12 text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                EUR
              </span>
            </div>
          </div>

          <button
            disabled
            className="w-full rounded-lg bg-red-600 py-2.5 font-medium text-white opacity-50"
          >
            Formular wird geladen...
          </button>
        </div>
      </div>
    </div>
  )
}

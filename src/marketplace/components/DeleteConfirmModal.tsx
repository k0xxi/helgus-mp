import { Trash2, X } from 'lucide-react'

interface DeleteConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  itemName: string
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmModal({
  isOpen,
  title,
  message,
  itemName,
  isLoading = false,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-lg bg-white dark:bg-slate-800 shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {title}
              </h2>
            </div>
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-50 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {message}
            </p>
            <p className="mt-3 break-words rounded-lg bg-slate-50 dark:bg-slate-900/50 p-3 text-sm font-medium text-slate-900 dark:text-slate-100">
              "{itemName}"
            </p>
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
          </div>

          {/* Footer */}
          <div className="flex gap-3 border-t border-slate-200 dark:border-slate-700 p-6">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-900 dark:text-white transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 cursor-pointer"
            >
              Abbrechen
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Wird gelöscht...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Löschen
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

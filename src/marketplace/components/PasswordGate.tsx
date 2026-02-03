import React, { useEffect, useState } from 'react'

interface PasswordGateProps {
  children: React.ReactNode
  password: string
}

export function PasswordGate({ children, password }: PasswordGateProps) {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [inputPassword, setInputPassword] = useState('')
  const [error, setError] = useState('')

  // Check if already unlocked on mount
  useEffect(() => {
    const stored = sessionStorage.getItem('marketplace_unlocked')
    if (stored === 'true') {
      setIsUnlocked(true)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputPassword === password) {
      sessionStorage.setItem('marketplace_unlocked', 'true')
      setIsUnlocked(true)
      setError('')
    } else {
      setError('Ungültiges Passwort')
      setInputPassword('')
    }
  }

  if (isUnlocked) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600 dark:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">
            HELGUS Marketplace
          </h1>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-6">
            Diese Seite ist passwortgeschützt
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Passwort eingeben
              </label>
              <input
                type="password"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                autoFocus
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full px-4 py-2.5 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
            >
              Zugriff gewähren
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
            Dies ist eine Test-Version. Kontaktiere den Administrator für Passwort-Zugriff.
          </p>
        </div>
      </div>
    </div>
  )
}

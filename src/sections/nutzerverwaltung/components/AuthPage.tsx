import { useState, useEffect } from 'react'
import type { LoginFormProps, RegistrationFormProps } from '@/../product/sections/nutzerverwaltung/types'
import { LoginForm } from './LoginForm'
import { RegistrationForm } from './RegistrationForm'

type AuthMode = 'login' | 'register'

export interface AuthPageProps extends Omit<LoginFormProps, 'onRegister'>, Omit<RegistrationFormProps, 'onLogin'> {
  /** Initial mode */
  initialMode?: AuthMode
}

export function AuthPage({
  initialMode = 'login',
  onLogin,
  onRegister,
  onSocialLogin,
  onForgotPassword,
  error,
  isLoading
}: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)

  // Sync with URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlMode = params.get('mode')
    if (urlMode === 'login' || urlMode === 'register') {
      setMode(urlMode)
    }

    // Listen for popstate events (browser back/forward)
    const handlePopState = () => {
      const newParams = new URLSearchParams(window.location.search)
      const newMode = newParams.get('mode')
      if (newMode === 'login' || newMode === 'register') {
        setMode(newMode)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return (
    <div className="flex flex-col">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-red-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-3xl" />
      </div>


      {/* Main Content */}
      <main className="relative z-10 flex items-start justify-center pt-8 px-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/50 dark:border-slate-800 p-8">
            {/* Tab Switcher */}
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 mb-8">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  mode === 'login'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Anmelden
              </button>
              <button
                onClick={() => setMode('register')}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  mode === 'register'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Registrieren
              </button>
            </div>

            {/* Forms */}
            {mode === 'login' ? (
              <LoginForm
                onLogin={onLogin}
                onSocialLogin={onSocialLogin}
                onForgotPassword={onForgotPassword}
                onRegister={() => setMode('register')}
                error={error}
                isLoading={isLoading}
              />
            ) : (
              <RegistrationForm
                onRegister={onRegister}
                onSocialLogin={onSocialLogin}
                onLogin={() => setMode('login')}
                error={error}
                isLoading={isLoading}
              />
            )}
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
            Mit der Nutzung von HELGUS stimmst du unseren{' '}
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300 underline">Nutzungsbedingungen</a>
            {' '}und{' '}
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300 underline">Datenschutzrichtlinien</a>
            {' '}zu.
          </p>
        </div>
      </main>
    </div>
  )
}

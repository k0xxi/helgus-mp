import { useState } from 'react'
import type { LoginFormProps, RegistrationFormProps } from '../types'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex flex-col">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-red-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 py-6 px-4">
        <div className="max-w-md mx-auto flex items-center justify-center">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:shadow-red-500/30 transition-shadow">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              HELGUS
            </span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-8 px-4">
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

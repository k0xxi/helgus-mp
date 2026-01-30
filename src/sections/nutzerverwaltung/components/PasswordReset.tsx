import { useState, useMemo } from 'react'
import type { PasswordResetProps, PasswordStrength } from '@/../product/sections/nutzerverwaltung/types'
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  KeyIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

export function PasswordReset({
  mode = 'request',
  onRequestReset,
  onResetPassword,
  onBackToLogin,
  error,
  success,
  isLoading = false
}: PasswordResetProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const passwordStrength = useMemo((): PasswordStrength => {
    if (!password) return 'schwach'

    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[0-9]/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++

    if (score <= 2) return 'schwach'
    if (score <= 3) return 'mittel'
    return 'stark'
  }, [password])

  const passwordRequirements = useMemo(() => [
    { met: password.length >= 8, text: 'Mindestens 8 Zeichen' },
    { met: /[0-9]/.test(password), text: 'Mindestens 1 Zahl' },
    { met: /[^a-zA-Z0-9]/.test(password), text: 'Mindestens 1 Sonderzeichen' },
  ], [password])

  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onRequestReset?.(email)
  }

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) return
    onResetPassword?.(password)
  }

  const strengthColors = {
    schwach: 'bg-red-500',
    mittel: 'bg-yellow-500',
    stark: 'bg-green-500'
  }

  const strengthLabels = {
    schwach: 'Schwach',
    mittel: 'Mittel',
    stark: 'Stark'
  }

  // Success state after request
  if (mode === 'request' && success) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl mb-6">
            <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            E-Mail gesendet
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            {success}
          </p>
          <button
            onClick={onBackToLogin}
            className="flex items-center justify-center gap-2 w-full py-3 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Zurück zum Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg shadow-red-500/25 mb-6">
          <KeyIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {mode === 'request' ? 'Passwort vergessen?' : 'Neues Passwort festlegen'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          {mode === 'request'
            ? 'Gib deine E-Mail-Adresse ein und wir senden dir einen Link zum Zurücksetzen.'
            : 'Wähle ein neues sicheres Passwort für dein Konto.'
          }
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {mode === 'request' ? (
        /* Request Reset Form */
        <form onSubmit={handleRequestSubmit} className="space-y-4">
          <div>
            <label htmlFor="reset-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              E-Mail-Adresse
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <EnvelopeIcon className="w-5 h-5 text-slate-400" />
              </div>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="deine@email.at"
                required
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Wird gesendet...
              </span>
            ) : (
              'Link senden'
            )}
          </button>
        </form>
      ) : (
        /* Reset Password Form */
        <form onSubmit={handleResetSubmit} className="space-y-4">
          {/* New Password */}
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Neues Passwort
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LockClosedIcon className="w-5 h-5 text-slate-400" />
              </div>
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Neues Passwort eingeben"
                required
                disabled={isLoading}
                className="w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Strength */}
            {password && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${strengthColors[passwordStrength]}`}
                      style={{ width: passwordStrength === 'schwach' ? '33%' : passwordStrength === 'mittel' ? '66%' : '100%' }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${
                    passwordStrength === 'schwach' ? 'text-red-500' :
                    passwordStrength === 'mittel' ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {strengthLabels[passwordStrength]}
                  </span>
                </div>
                <ul className="space-y-1">
                  {passwordRequirements.map((req, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        req.met ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                      }`}>
                        {req.met && <CheckIcon className="w-3 h-3" />}
                      </span>
                      <span className={req.met ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}>
                        {req.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirm-new-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Passwort bestätigen
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LockClosedIcon className="w-5 h-5 text-slate-400" />
              </div>
              <input
                id="confirm-new-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Passwort wiederholen"
                required
                disabled={isLoading}
                className={`w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-colors disabled:opacity-50 ${
                  confirmPassword && !passwordsMatch
                    ? 'border-red-500 focus:border-red-500'
                    : confirmPassword && passwordsMatch
                    ? 'border-green-500 focus:border-green-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-red-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="mt-1 text-xs text-red-500">Passwörter stimmen nicht überein</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !passwordsMatch}
            className="w-full py-3.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Wird gespeichert...
              </span>
            ) : (
              'Passwort speichern'
            )}
          </button>
        </form>
      )}

      {/* Back to Login */}
      <button
        onClick={onBackToLogin}
        disabled={isLoading}
        className="mt-6 flex items-center justify-center gap-2 w-full py-3 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Zurück zum Login
      </button>
    </div>
  )
}

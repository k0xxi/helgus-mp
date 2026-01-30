import { useState, useMemo } from 'react'
import type { ChangePasswordProps, PasswordStrength } from '../types'
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

export function ChangePassword({
  onChangePassword,
  onCancel,
  error,
  isLoading = false
}: ChangePasswordProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const passwordStrength = useMemo((): PasswordStrength => {
    if (!newPassword) return 'schwach'

    let score = 0
    if (newPassword.length >= 8) score++
    if (newPassword.length >= 12) score++
    if (/[0-9]/.test(newPassword)) score++
    if (/[^a-zA-Z0-9]/.test(newPassword)) score++
    if (/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)) score++

    if (score <= 2) return 'schwach'
    if (score <= 3) return 'mittel'
    return 'stark'
  }, [newPassword])

  const passwordRequirements = useMemo(() => [
    { met: newPassword.length >= 8, text: 'Mindestens 8 Zeichen' },
    { met: /[0-9]/.test(newPassword), text: 'Mindestens 1 Zahl' },
    { met: /[^a-zA-Z0-9]/.test(newPassword), text: 'Mindestens 1 Sonderzeichen' },
  ], [newPassword])

  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0
  const isNewPasswordDifferent = newPassword !== currentPassword && newPassword.length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) return
    if (newPassword === currentPassword) return
    onChangePassword?.(currentPassword, newPassword)
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

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg shadow-red-500/25 mb-6">
          <ShieldCheckIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Passwort ändern
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Ändere dein Passwort regelmäßig für mehr Sicherheit
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Password */}
        <div>
          <label htmlFor="current-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Aktuelles Passwort
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <LockClosedIcon className="w-5 h-5 text-slate-400" />
            </div>
            <input
              id="current-password"
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Aktuelles Passwort eingeben"
              required
              disabled={isLoading}
              className="w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showCurrentPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label htmlFor="change-new-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Neues Passwort
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <LockClosedIcon className="w-5 h-5 text-slate-400" />
            </div>
            <input
              id="change-new-password"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Neues Passwort eingeben"
              required
              disabled={isLoading}
              className="w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showNewPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>

          {/* Password Strength */}
          {newPassword && (
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
              {!isNewPasswordDifferent && currentPassword && (
                <p className="text-xs text-red-500">Neues Passwort muss sich vom aktuellen unterscheiden</p>
              )}
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="change-confirm-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Neues Passwort bestätigen
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <LockClosedIcon className="w-5 h-5 text-slate-400" />
            </div>
            <input
              id="change-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Neues Passwort wiederholen"
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

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            disabled={isLoading || !passwordsMatch || !isNewPasswordDifferent}
            className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Speichern...
              </span>
            ) : (
              'Passwort ändern'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

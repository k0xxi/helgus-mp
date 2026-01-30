import { useState } from 'react'
import { PasswordReset } from './components/PasswordReset'
import { ChangePassword } from './components/ChangePassword'

type View = 'request' | 'reset' | 'change'

export default function PasswordManagementPreview() {
  const [view, setView] = useState<View>('request')
  const [success, setSuccess] = useState<string | undefined>()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 py-12">
      {/* View Switcher (for demo purposes) */}
      <div className="max-w-md mx-auto px-4 mb-8">
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
          <button
            onClick={() => { setView('request'); setSuccess(undefined) }}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
              view === 'request'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Passwort vergessen
          </button>
          <button
            onClick={() => { setView('reset'); setSuccess(undefined) }}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
              view === 'reset'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Zurücksetzen
          </button>
          <button
            onClick={() => { setView('change'); setSuccess(undefined) }}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
              view === 'change'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Passwort ändern
          </button>
        </div>
      </div>

      {/* Forms */}
      {view === 'change' ? (
        <ChangePassword
          onChangePassword={(current, newPw) => console.log('Change password:', { current, newPw })}
          onCancel={() => console.log('Cancel')}
        />
      ) : (
        <PasswordReset
          mode={view}
          onRequestReset={(email) => {
            console.log('Request reset for:', email)
            setSuccess('Wir haben dir einen Link zum Zurücksetzen deines Passworts an ' + email + ' gesendet.')
          }}
          onResetPassword={(password) => console.log('Reset password:', password)}
          onBackToLogin={() => console.log('Back to login')}
          success={success}
        />
      )}
    </div>
  )
}

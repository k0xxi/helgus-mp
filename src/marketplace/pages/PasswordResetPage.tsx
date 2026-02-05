import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/marketplace/context/AuthContext'
import { PasswordReset } from '@/sections/nutzerverwaltung/components'

export function PasswordResetPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { resetPassword, updatePassword } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const [success, setSuccess] = useState<string | undefined>(undefined)

  // Determine mode from URL: 'reset' when coming from email link, 'request' otherwise
  const mode = searchParams.get('mode') === 'reset' ? 'reset' : 'request'

  const handleRequestReset = async (email: string) => {
    setLoading(true)
    setError(undefined)
    setSuccess(undefined)

    try {
      const { error } = await resetPassword(email)
      if (error) {
        setError(error.message)
      } else {
        setSuccess('Wir haben dir eine E-Mail mit einem Link zum Zurücksetzen deines Passworts gesendet. Bitte überprüfe auch deinen Spam-Ordner.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (newPassword: string) => {
    setLoading(true)
    setError(undefined)

    try {
      const { error } = await updatePassword(newPassword)
      if (error) {
        setError(error.message)
      } else {
        // Redirect to auth page with success message
        navigate('/auth?passwordReset=success')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleBackToLogin = () => {
    navigate('/auth')
  }

  return (
    <div className="flex items-start justify-center pt-8 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/50 dark:border-slate-800 p-8">
          <PasswordReset
            mode={mode as 'request' | 'reset'}
            onRequestReset={handleRequestReset}
            onResetPassword={handleResetPassword}
            onBackToLogin={handleBackToLogin}
            error={error}
            success={success}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  )
}

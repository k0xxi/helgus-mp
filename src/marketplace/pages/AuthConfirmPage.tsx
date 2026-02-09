import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export function AuthConfirmPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const tokenHash = searchParams.get('token_hash')
    const type = searchParams.get('type') as 'signup' | 'recovery' | 'magiclink' | 'email_change'

    if (!tokenHash || !type) {
      setError('Ungültiger Bestätigungslink.')
      return
    }

    const verify = async () => {
      try {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type,
        })

        if (error) {
          console.error('Verification error:', error)
          setError(error.message)
          return
        }

        // Weiterleitung basierend auf Typ
        if (type === 'recovery') {
          navigate('/auth/reset-password?mode=reset', { replace: true })
        } else {
          // signup, email_change, magiclink - User ist jetzt eingeloggt
          navigate('/', { replace: true })
        }
      } catch (err) {
        console.error('Unexpected verification error:', err)
        setError('Ein unerwarteter Fehler ist aufgetreten.')
      }
    }

    verify()
  }, [searchParams, navigate])

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl mb-6">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            Bestätigung fehlgeschlagen
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            {error}
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors"
          >
            Zurück zur Anmeldung
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4" />
        <p className="text-slate-600 dark:text-slate-400">
          E-Mail wird bestätigt...
        </p>
      </div>
    </div>
  )
}

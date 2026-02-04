import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Exchange the code for a session
        const { data, error } = await supabase.auth.exchangeCodeForSession(
          window.location.href
        )

        if (error) {
          console.error('OAuth callback error:', error)
          setError(error.message)
          return
        }

        if (data.session) {
          // Check if this is a new user (no profile exists)
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', data.session.user.id)
            .single()

          if (profileError && profileError.code === 'PGRST116') {
            // No profile exists - create one
            const userName = data.session.user.user_metadata?.full_name
              || data.session.user.user_metadata?.name
              || data.session.user.email?.split('@')[0]
              || 'User'

            await supabase.from('profiles').insert({
              id: data.session.user.id,
              name: userName,
            })
          }

          // Success - redirect to marketplace
          navigate('/', { replace: true })
        }
      } catch (err) {
        console.error('Unexpected error during OAuth callback:', err)
        setError('Ein unerwarteter Fehler ist aufgetreten.')
      }
    }

    handleCallback()
  }, [navigate])

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
            Anmeldung fehlgeschlagen
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
          Anmeldung wird abgeschlossen...
        </p>
      </div>
    </div>
  )
}

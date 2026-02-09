import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/marketplace/context/AuthContext'
import { AuthPage as DesignOSAuthPage } from '@/sections/nutzerverwaltung/components'
import type { SocialProvider, RegistrationData } from '@/../product/sections/nutzerverwaltung/types'

export function AuthPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { signIn, signUp, signInWithOAuth, user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const [emailConfirmationSent, setEmailConfirmationSent] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  const handleLogin = async (email: string, password: string, _rememberMe: boolean) => {
    setLoading(true)
    setError(undefined)

    try {
      const { error } = await signIn({ email, password })
      if (error) {
        setError(error.message)
      } else {
        navigate('/')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (data: RegistrationData) => {
    setLoading(true)
    setError(undefined)

    try {
      const { error } = await signUp({
        email: data.email,
        password: data.password,
        name: data.name,
      })
      if (error) {
        setError(error.message)
      } else {
        setEmailConfirmationSent(true)
        setRegisteredEmail(data.email)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: SocialProvider) => {
    setLoading(true)
    setError(undefined)

    try {
      // Map Design OS provider to Supabase provider
      const supabaseProvider = provider === 'google' ? 'google' : 'apple'
      const { error } = await signInWithOAuth(supabaseProvider)
      if (error) {
        setError(error.message)
      }
      // OAuth will redirect, so we don't need to navigate
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = () => {
    navigate('/auth/reset-password')
  }

  // E-Mail-Bestätigung gesendet - Hinweis anzeigen
  if (emailConfirmationSent) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl mb-6">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            Bestätigungsmail gesendet
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-2">
            Wir haben eine Bestätigungsmail an
          </p>
          <p className="text-slate-900 dark:text-white font-semibold mb-4">
            {registeredEmail}
          </p>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            gesendet. Bitte klicke auf den Link in der E-Mail, um dein Konto zu aktivieren.
          </p>
          <button
            onClick={() => {
              setEmailConfirmationSent(false)
              setRegisteredEmail('')
            }}
            className="px-6 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
          >
            Zurück zur Anmeldung
          </button>
        </div>
      </div>
    )
  }

  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login'

  return (
    <DesignOSAuthPage
      initialMode={initialMode}
      onLogin={handleLogin}
      onRegister={handleRegister}
      onSocialLogin={handleSocialLogin}
      onForgotPassword={handleForgotPassword}
      error={error}
      isLoading={loading}
    />
  )
}

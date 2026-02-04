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
        navigate('/')
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

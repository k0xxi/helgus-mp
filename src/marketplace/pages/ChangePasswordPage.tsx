import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/marketplace/context/AuthContext'
import { ChangePassword } from '@/sections/nutzerverwaltung/components'
import { supabase } from '@/lib/supabase'

export function ChangePasswordPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/marketplace/auth')
    }
  }, [user, authLoading, navigate])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    )
  }

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    setLoading(true)
    setError(undefined)

    try {
      // First, verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email ?? '',
        password: currentPassword,
      })

      if (signInError) {
        setError('Das aktuelle Passwort ist falsch.')
        setLoading(false)
        return
      }

      // Now update to the new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }

      // Success - redirect to profile settings
      navigate('/marketplace/profile/settings?passwordChanged=success')
    } catch (err) {
      setError('Ein unerwarteter Fehler ist aufgetreten.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/marketplace/profile/settings')
  }

  return (
    <div className="min-h-[50vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
          <ChangePassword
            onChangePassword={handleChangePassword}
            onCancel={handleCancel}
            error={error}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  )
}

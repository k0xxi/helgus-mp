import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { User, Session, Provider } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Profile, SignUpData, SignInData } from '@/types/marketplace'
import type { Tables, UpdateTables } from '@/types/database'

export interface ProfileUpdateData {
  name?: string
  bio?: string | null
  phone?: string | null
  street?: string | null
  house_number?: string | null
  zip?: string | null
  city?: string | null
  country?: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signUp: (data: SignUpData) => Promise<{ error: Error | null }>
  signIn: (data: SignInData) => Promise<{ error: Error | null }>
  signInWithOAuth: (provider: Provider) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>
  updateProfile: (data: ProfileUpdateData) => Promise<{ error: Error | null }>
  uploadAvatar: (file: File) => Promise<{ url: string | null; error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function mapDbProfileToProfile(data: Tables<'profiles'>): Profile {
  return {
    id: data.id,
    name: data.name,
    avatarUrl: data.avatar_url,
    bio: data.bio,
    phone: data.phone,
    street: data.street || null,
    houseNumber: data.house_number || null,
    zip: data.zip,
    city: data.city,
    country: data.country,
    isVerified: data.is_verified,
    verifiedAt: data.verified_at ? new Date(data.verified_at) : null,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('[Auth] Error fetching profile:', error)
        return null
      }

      if (!data) {
        return null
      }

      return mapDbProfileToProfile(data)
    } catch (err) {
      console.error('[Auth] Exception fetching profile:', err)
      return null
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user) {
      const profileData = await fetchProfile(user.id)
      setProfile(profileData)
    }
  }, [user, fetchProfile])

  useEffect(() => {
    let isMounted = true

    // Timeout fallback - ensure loading state resolves
    const timeout = setTimeout(() => {
      if (isMounted) {
        setLoading(false)
      }
    }, 5000)

    // Get initial session
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (!isMounted) return
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          fetchProfile(session.user.id).then((profile) => {
            if (isMounted) setProfile(profile)
          })
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error getting session:', error)
        if (isMounted) {
          setLoading(false)
        }
      })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        const profileData = await fetchProfile(session.user.id)
        if (isMounted) setProfile(profileData)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => {
      isMounted = false
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  const signUp = async ({ email, password, name }: SignUpData): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name, // Pass name to user metadata - the database trigger will use this
          },
        },
      })

      if (error) {
        return { error }
      }

      // Profile is created automatically by the database trigger (handle_new_user)
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signIn = async ({ email, password }: SignInData): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error }
      }

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setSession(null)
  }

  const signInWithOAuth = async (provider: Provider): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/marketplace/auth/callback`,
        },
      })
      if (error) {
        return { error }
      }
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const resetPassword = async (email: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/marketplace/auth/reset-password?mode=reset`,
      })
      if (error) {
        return { error }
      }
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const updatePassword = async (newPassword: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })
      if (error) {
        return { error }
      }
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const updateProfile = async (data: ProfileUpdateData): Promise<{ error: Error | null }> => {
    if (!user) {
      return { error: new Error('Not authenticated') }
    }
    try {
      const updateData: UpdateTables<'profiles'> = {}
      if (data.name !== undefined) updateData.name = data.name
      if (data.bio !== undefined) updateData.bio = data.bio
      if (data.phone !== undefined) updateData.phone = data.phone
      if (data.street !== undefined) updateData.street = data.street
      if (data.house_number !== undefined) updateData.house_number = data.house_number
      if (data.zip !== undefined) updateData.zip = data.zip
      if (data.city !== undefined) updateData.city = data.city
      if (data.country !== undefined) updateData.country = data.country

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)

      if (error) {
        return { error }
      }

      // Refresh the profile after update
      await refreshProfile()
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const uploadAvatar = async (file: File): Promise<{ url: string | null; error: Error | null }> => {
    if (!user) {
      return { url: null, error: new Error('Not authenticated') }
    }
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        return { url: null, error: uploadError }
      }

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath)

      // Update the profile with the new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) {
        return { url: null, error: updateError }
      }

      await refreshProfile()
      return { url: publicUrl, error: null }
    } catch (error) {
      return { url: null, error: error as Error }
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    refreshProfile,
    resetPassword,
    updatePassword,
    updateProfile,
    uploadAvatar,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

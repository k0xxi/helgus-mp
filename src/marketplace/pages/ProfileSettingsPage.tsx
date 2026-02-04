import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings } from 'lucide-react'
import { useAuth } from '@/marketplace/context/AuthContext'
import { ProfileSettings } from '@/sections/nutzerverwaltung/components'
import type { User as DesignOSUser, Country, ConnectedAccount } from '@/../product/sections/nutzerverwaltung/types'

// Default countries for the form
const COUNTRIES: Country[] = [
  { code: 'AT', name: 'Österreich' },
  { code: 'DE', name: 'Deutschland' },
  { code: 'CH', name: 'Schweiz' },
]

export function ProfileSettingsPage() {
  const navigate = useNavigate()
  const { user, profile, updateProfile, signOut, loading } = useAuth()

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth')
    }
  }, [user, loading, navigate])

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    )
  }

  // Map marketplace profile to Design OS user type
  const designOSUser: DesignOSUser = {
    id: profile.id,
    email: user?.email ?? '',
    name: profile.name,
    avatar: profile.avatarUrl ?? undefined,
    bio: profile.bio ?? undefined,
    phone: profile.phone ?? undefined,
    address: profile.zip && profile.city ? {
      street: profile.street ?? '',
      houseNumber: profile.houseNumber ?? '',
      zip: profile.zip,
      city: profile.city,
      country: profile.country,
    } : undefined,
    memberSince: profile.createdAt.toISOString(),
    isVerified: profile.isVerified,
    verificationDate: profile.verifiedAt?.toISOString(),
    notificationSettings: {
      emailMessages: true,
      emailOffers: true,
      emailListingUpdates: false,
      pushEnabled: true,
      newsletter: false,
    },
  }

  // For now, we don't support connected accounts
  const connectedAccounts: ConnectedAccount[] = []

  const handleSaveProfile = async (data: Partial<DesignOSUser>) => {
    console.log('ProfileSettingsPage: handleSaveProfile called')
    console.log('ProfileSettingsPage: Address from data:', data.address)
    const updateData = {
      name: data.name,
      bio: data.bio,
      phone: data.phone,
      street: data.address?.street,
      house_number: data.address?.houseNumber,
      zip: data.address?.zip,
      city: data.address?.city,
      country: data.address?.country,
    }
    console.log('ProfileSettingsPage: Sending to updateProfile:', updateData)
    const { error } = await updateProfile(updateData)
    if (error) {
      console.error('ProfileSettingsPage: Failed to save profile:', error)
    } else {
      console.log('ProfileSettingsPage: Profile saved successfully')
    }
  }

  const handleChangePassword = () => {
    navigate('/profile/change-password')
  }

  const handleStartVerification = () => {
    navigate('/profile/verification')
  }

  const handleConnectAccount = async (provider: 'google' | 'apple') => {
    // OAuth account linking would require additional Supabase setup
  }

  const handleDisconnectAccount = async (accountId: string) => {
    // Account disconnection would require Supabase setup
  }

  const handleDeleteAccount = async () => {
    // Account deletion would need to be handled server-side
    // For now, just sign out
    if (confirm('Bist du sicher, dass du dein Konto löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      await signOut()
      navigate('/')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-slate-800 dark:to-slate-900 rounded-lg px-6 py-8 border border-red-100 dark:border-red-900/30">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-red-600 dark:text-red-500" />
          <span className="text-sm font-semibold text-red-600 dark:text-red-500">Einstellungen</span>
        </div>
        <div className="mb-3">
          <h1 className="text-[2rem] font-bold text-slate-900 dark:text-white">
            Profil <span className="text-red-600 dark:text-red-500">Einstellungen</span>
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
          Verwalten Sie Ihre persönlichen Daten, Passwort und Benachrichtigungseinstellungen.
        </p>
      </div>
      <ProfileSettings
        user={designOSUser}
        connectedAccounts={connectedAccounts}
        countries={COUNTRIES}
        onSaveProfile={handleSaveProfile}
        onChangePassword={handleChangePassword}
        onStartVerification={handleStartVerification}
        onConnectAccount={handleConnectAccount}
        onDisconnectAccount={handleDisconnectAccount}
        onDeleteAccount={handleDeleteAccount}
      />
    </div>
  )
}

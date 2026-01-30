import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
      navigate('/marketplace/auth')
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
      street: '',
      houseNumber: '',
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
    await updateProfile({
      name: data.name,
      bio: data.bio,
      phone: data.phone,
      zip: data.address?.zip,
      city: data.address?.city,
      country: data.address?.country,
    })
  }

  const handleChangePassword = () => {
    navigate('/marketplace/profile/change-password')
  }

  const handleStartVerification = () => {
    navigate('/marketplace/profile/verification')
  }

  const handleConnectAccount = async (provider: 'google' | 'apple') => {
    // OAuth account linking would require additional Supabase setup
    console.log('Connect account:', provider)
  }

  const handleDisconnectAccount = async (accountId: string) => {
    console.log('Disconnect account:', accountId)
  }

  const handleDeleteAccount = async () => {
    // Account deletion would need to be handled server-side
    // For now, just sign out
    if (confirm('Bist du sicher, dass du dein Konto löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      await signOut()
      navigate('/marketplace')
    }
  }

  return (
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
  )
}

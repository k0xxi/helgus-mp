import { useParams, useNavigate } from 'react-router-dom'
import { usePublicProfile, useUserListings } from '@/hooks'
import { PublicProfile } from '@/sections/nutzerverwaltung/components'
import type { PublicProfile as DesignOSProfile, UserListing } from '@/../product/sections/nutzerverwaltung/types'
import { UserCircleIcon } from '@heroicons/react/24/outline'

export function PublicProfilePage() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const { profile, loading: profileLoading, error: profileError } = usePublicProfile(userId)
  const { listings, loading: listingsLoading } = useUserListings(userId)

  const loading = profileLoading || listingsLoading

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    )
  }

  if (profileError || !profile) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
          <UserCircleIcon className="w-10 h-10 text-slate-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Benutzer nicht gefunden
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Das gesuchte Profil existiert nicht oder wurde gelöscht.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium rounded-xl transition-colors"
        >
          Zurück zum Marktplatz
        </button>
      </div>
    )
  }

  // Map marketplace profile to Design OS profile type
  const designOSProfile: DesignOSProfile = {
    id: profile.id,
    name: profile.name,
    avatar: profile.avatarUrl ?? undefined,
    bio: profile.bio ?? undefined,
    city: profile.city ?? 'Unbekannt',
    country: profile.country,
    memberSince: profile.memberSince.toISOString(),
    isVerified: profile.isVerified,
    listingsCount: profile.listingsCount,
    responseTime: profile.responseTime,
  }

  // Map listings to Design OS format
  const designOSListings: UserListing[] = listings.map(listing => ({
    id: listing.id,
    title: listing.title,
    price: listing.price,
    image: listing.image,
    location: listing.location,
    condition: listing.condition as UserListing['condition'],
    createdAt: listing.createdAt,
  }))

  const handleSendMessage = (sellerId: string) => {
    // Navigate to messages with this user
    navigate(`/messages?user=${sellerId}`)
  }

  const handleViewListing = (listingId: string) => {
    navigate(`/product/${listingId}`)
  }

  const handleViewAllListings = (sellerId: string) => {
    navigate(`/search?seller=${sellerId}`)
  }

  return (
    <PublicProfile
      profile={designOSProfile}
      listings={designOSListings}
      onSendMessage={handleSendMessage}
      onViewListing={handleViewListing}
      onViewAllListings={handleViewAllListings}
    />
  )
}

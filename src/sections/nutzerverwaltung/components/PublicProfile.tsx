import type { PublicProfileProps, UserListing } from '@/../product/sections/nutzerverwaltung/types'
import {
  CheckBadgeIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { CheckBadgeIcon as CheckBadgeSolidIcon } from '@heroicons/react/24/solid'

export function PublicProfile({
  profile,
  listings,
  onSendMessage,
  onViewListing,
  onViewAllListings
}: PublicProfileProps) {
  const visibleListings = listings.slice(0, 6)
  const hasMoreListings = listings.length > 6

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('de-AT', {
      month: 'long',
      year: 'numeric'
    })
  }

  const conditionLabels: Record<string, string> = {
    'neu': 'Neu',
    'wie-neu': 'Wie neu',
    'sehr-gut': 'Sehr gut',
    'gut': 'Gut',
    'akzeptabel': 'Akzeptabel'
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-br from-red-500 via-red-600 to-red-700 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6 -mt-16 relative">
          {/* Avatar */}
          <div className="mb-4">
            <div className="w-32 h-32 rounded-2xl border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden bg-slate-100 dark:bg-slate-700">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-slate-400">
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Name & Badge */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {profile.name}
                </h1>
                {profile.isVerified && (
                  <div className="relative group">
                    <CheckBadgeSolidIcon className="w-7 h-7 text-blue-500" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Verifizierter Verkäufer
                    </div>
                  </div>
                )}
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="text-slate-600 dark:text-slate-400 mb-4 max-w-xl">
                  {profile.bio}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{profile.city}, {profile.country}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CalendarDaysIcon className="w-4 h-4" />
                  <span>Mitglied seit {formatDate(profile.memberSince)}</span>
                </div>
                {profile.responseTime && (
                  <div className="flex items-center gap-1.5">
                    <ClockIcon className="w-4 h-4" />
                    <span>{profile.responseTime}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => onSendMessage?.(profile.id)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all"
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
              Nachricht senden
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Aktive Anzeigen"
          value={profile.listingsCount.toString()}
          accent
        />
        <StatCard
          label="Mitglied seit"
          value={new Date(profile.memberSince).getFullYear().toString()}
        />
        <StatCard
          label="Status"
          value={profile.isVerified ? 'Verifiziert' : 'Standard'}
          badge={profile.isVerified}
        />
        <StatCard
          label="Antwortzeit"
          value={profile.responseTime ? '< 2h' : '-'}
        />
      </div>

      {/* Listings Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Anzeigen von {profile.name}
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {profile.listingsCount} Anzeige{profile.listingsCount !== 1 ? 'n' : ''}
          </span>
        </div>

        {visibleListings.length > 0 ? (
          <>
            {/* Listings Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onClick={() => onViewListing?.(listing.id)}
                    conditionLabel={conditionLabels[listing.condition] || listing.condition}
                  />
                ))}
              </div>
            </div>

            {/* View All Button */}
            {hasMoreListings && (
              <div className="px-6 pb-6">
                <button
                  onClick={() => onViewAllListings?.(profile.id)}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl text-slate-700 dark:text-slate-300 font-medium transition-colors"
                >
                  Alle {profile.listingsCount} Anzeigen anzeigen
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-slate-500 dark:text-slate-400">
              Keine aktiven Anzeigen vorhanden
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper Components

interface StatCardProps {
  label: string
  value: string
  accent?: boolean
  badge?: boolean
}

function StatCard({ label, value, accent, badge }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
      <p className={`text-2xl font-bold mb-1 ${accent ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
        {badge && <CheckBadgeIcon className="w-5 h-5 text-blue-500 inline mr-1 -mt-1" />}
        {value}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  )
}

interface ListingCardProps {
  listing: UserListing
  onClick?: () => void
  conditionLabel: string
}

function ListingCard({ listing, onClick, conditionLabel }: ListingCardProps) {
  return (
    <button
      onClick={onClick}
      className="group text-left bg-slate-50 dark:bg-slate-700/50 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none transition-all hover:-translate-y-1"
    >
      {/* Image */}
      <div className="aspect-[4/3] relative overflow-hidden">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-xs font-medium text-slate-700 dark:text-slate-300 rounded-lg">
            {conditionLabel}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-medium text-slate-900 dark:text-white mb-1 line-clamp-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
          {listing.title}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-red-600 dark:text-red-400">
            € {listing.price.toLocaleString('de-AT')}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {listing.location.city}
          </p>
        </div>
      </div>
    </button>
  )
}

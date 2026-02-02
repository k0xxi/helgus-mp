import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Package,
  Plus,
  Eye,
  Pencil,
  Pause,
  Play,
  CheckCircle,
  Trash2,
  MapPin,
  AlertTriangle,
} from 'lucide-react'
import { useAuth } from '@/marketplace/context/AuthContext'
import { useMyListings, type ListingStatus } from '@/marketplace/hooks'

const STATUS_LABELS: Record<ListingStatus, string> = {
  active: 'Aktiv',
  paused: 'Pausiert',
  sold: 'Verkauft',
}

const STATUS_COLORS: Record<ListingStatus, string> = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  paused: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  sold: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
}

const CONDITION_LABELS: Record<string, string> = {
  'neu': 'Neu',
  'wie-neu': 'Wie neu',
  'sehr-gut': 'Sehr gut',
  'gut': 'Gut',
  'akzeptabel': 'Akzeptabel',
}

export function MyListingsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { listings, loading, togglePause, markAsSold, deleteListing } = useMyListings(user?.id)
  const [statusFilter, setStatusFilter] = useState<ListingStatus | 'all'>('all')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [confirmSold, setConfirmSold] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const filteredListings = statusFilter === 'all'
    ? listings
    : listings.filter(l => l.status === statusFilter)

  const statusCounts = {
    all: listings.length,
    active: listings.filter(l => l.status === 'active').length,
    paused: listings.filter(l => l.status === 'paused').length,
    sold: listings.filter(l => l.status === 'sold').length,
  }

  const handleTogglePause = async (listingId: string) => {
    setActionLoading(listingId)
    const { error } = await togglePause(listingId)
    if (error) {
      console.error('Error toggling pause:', error)
    }
    setActionLoading(null)
  }

  const handleMarkAsSold = async (listingId: string) => {
    setActionLoading(listingId)
    setConfirmSold(null)
    const { error } = await markAsSold(listingId)
    if (error) {
      console.error('Error marking as sold:', error)
    }
    setActionLoading(null)
  }

  const handleDelete = async (listingId: string) => {
    setActionLoading(listingId)
    setConfirmDelete(null)
    const { error } = await deleteListing(listingId)
    if (error) {
      console.error('Error deleting listing:', error)
    }
    setActionLoading(null)
  }

  const handleView = (listingId: string) => {
    navigate(`/marketplace/product/${listingId}`)
  }

  const handleEdit = (listingId: string) => {
    navigate(`/marketplace/sell?edit=${listingId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="h-6 w-6 text-slate-400" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Meine Anzeigen
          </h1>
        </div>
        <button
          onClick={() => navigate('/marketplace/sell')}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Neue Anzeige
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
        {(['all', 'active', 'paused', 'sold'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              statusFilter === status
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {status === 'all' ? 'Alle' : STATUS_LABELS[status]}
            <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-700">
              {statusCounts[status]}
            </span>
          </button>
        ))}
      </div>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
          <Package className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
          <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">
            {statusFilter === 'all' ? 'Keine Anzeigen vorhanden' : `Keine ${STATUS_LABELS[statusFilter as ListingStatus].toLowerCase()}en Anzeigen`}
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {statusFilter === 'all'
              ? 'Erstelle deine erste Anzeige und beginne zu verkaufen.'
              : 'Keine Anzeigen in dieser Kategorie.'}
          </p>
          {statusFilter === 'all' && (
            <button
              onClick={() => navigate('/marketplace/sell')}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Erste Anzeige erstellen
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map((listing) => (
            <div
              key={listing.id}
              className={`rounded-lg border bg-white overflow-hidden dark:bg-slate-800 transition-opacity ${
                actionLoading === listing.id ? 'opacity-50 pointer-events-none' : ''
              } border-slate-200 dark:border-slate-700`}
            >
              {/* Image */}
              <div
                className="relative aspect-[4/3] cursor-pointer"
                onClick={() => handleView(listing.id)}
              >
                <img
                  src={listing.image}
                  alt={listing.title}
                  className={`h-full w-full object-cover ${
                    listing.status === 'sold' ? 'opacity-60 grayscale' : ''
                  }`}
                />
                {/* Status Badge */}
                <span
                  className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[listing.status]}`}
                >
                  {STATUS_LABELS[listing.status]}
                </span>
                {/* Sold Overlay */}
                {listing.status === 'sold' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="rounded-lg bg-slate-900/80 px-4 py-2 text-lg font-bold text-white">
                      VERKAUFT
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3
                  className="font-medium text-slate-900 dark:text-white truncate cursor-pointer hover:text-red-600 dark:hover:text-red-400"
                  onClick={() => handleView(listing.id)}
                >
                  {listing.title}
                </h3>
                <p className="text-lg font-bold text-red-600 dark:text-red-400">
                  {listing.price.toLocaleString('de-AT')} €
                </p>

                {/* Meta Info */}
                <div className="mt-2 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {listing.location.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {listing.viewCount} Aufrufe
                  </span>
                  <span>{CONDITION_LABELS[listing.condition] || listing.condition}</span>
                </div>

                {/* Quick Action Buttons */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {/* Ansehen */}
                  <button
                    onClick={() => handleView(listing.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                    title="Ansehen"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Ansehen
                  </button>

                  {listing.status !== 'sold' && (
                    <>
                      {/* Bearbeiten */}
                      <button
                        onClick={() => handleEdit(listing.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                        title="Bearbeiten"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Bearbeiten
                      </button>

                      {/* Pausieren / Aktivieren */}
                      <button
                        onClick={() => handleTogglePause(listing.id)}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium ${
                          listing.status === 'paused'
                            ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30'
                            : 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/30'
                        }`}
                        title={listing.status === 'paused' ? 'Aktivieren' : 'Pausieren'}
                      >
                        {listing.status === 'paused' ? (
                          <>
                            <Play className="h-3.5 w-3.5" />
                            Aktivieren
                          </>
                        ) : (
                          <>
                            <Pause className="h-3.5 w-3.5" />
                            Pausieren
                          </>
                        )}
                      </button>

                      {/* Als verkauft */}
                      <button
                        onClick={() => setConfirmSold(listing.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                        title="Als verkauft markieren"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Verkauft
                      </button>
                    </>
                  )}

                  {/* Löschen */}
                  <button
                    onClick={() => setConfirmDelete(listing.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                    title="Löschen"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Löschen
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mark as Sold Confirmation Modal */}
      {confirmSold && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 dark:bg-slate-800">
            <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
              <CheckCircle className="h-6 w-6" />
              <h3 className="text-lg font-semibold">Als verkauft markieren?</h3>
            </div>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Möchtest du diese Anzeige als verkauft markieren? Die Anzeige wird dann nicht mehr in der Suche angezeigt.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirmSold(null)}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Abbrechen
              </button>
              <button
                onClick={() => handleMarkAsSold(confirmSold)}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Als verkauft markieren
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 dark:bg-slate-800">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-lg font-semibold">Anzeige löschen?</h3>
            </div>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Bist du sicher, dass du diese Anzeige löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Abbrechen
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import type {
  ProfileSettingsProps,
  User,
  SocialProvider,
  NotificationSettings
} from '@/../product/sections/nutzerverwaltung/types'
import {
  UserCircleIcon,
  MapPinIcon,
  BellIcon,
  ShieldCheckIcon,
  CameraIcon,
  CheckBadgeIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

type TabId = 'personal' | 'address' | 'notifications' | 'security'

interface Tab {
  id: TabId
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const TABS: Tab[] = [
  { id: 'personal', label: 'Persönliche Daten', icon: UserCircleIcon },
  { id: 'address', label: 'Adresse & Standort', icon: MapPinIcon },
  { id: 'notifications', label: 'Benachrichtigungen', icon: BellIcon },
  { id: 'security', label: 'Sicherheit', icon: ShieldCheckIcon },
]

export function ProfileSettings({
  user,
  connectedAccounts,
  countries,
  onSaveProfile,
  onChangePassword,
  onStartVerification,
  onConnectAccount,
  onDisconnectAccount,
  onDeleteAccount
}: ProfileSettingsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('personal')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState<Partial<User>>({
    name: user.name,
    bio: user.bio || '',
    email: user.email,
    phone: user.phone || '',
    avatar: user.avatar,
    address: user.address,
    notificationSettings: user.notificationSettings
  })

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    onSaveProfile?.(formData)
    // Simulate save
    setTimeout(() => {
      setIsSaving(false)
      setIsEditing(false)
    }, 1000)
  }

  const updateFormData = (updates: Partial<User>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const updateNotifications = (key: keyof NotificationSettings, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      notificationSettings: {
        ...prev.notificationSettings!,
        [key]: value
      }
    }))
  }

  return (
    <div>
      {/* Profile Summary Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-700">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt={formData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UserCircleIcon className="w-12 h-12 text-slate-400" />
                </div>
              )}
            </div>
            <button
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
              title="Bild ändern"
            >
              <CameraIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {user.name}
              </h2>
              {user.isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
                  <CheckBadgeIcon className="w-3.5 h-3.5" />
                  Verifiziert
                </span>
              )}
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">
              {user.email}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Mitglied seit {new Date(user.memberSince).toLocaleDateString('de-AT', {
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>

          {/* Verification Badge / CTA */}
          {!user.isVerified && (
            <button
              onClick={onStartVerification}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-500/25 transition-all"
            >
              Jetzt verifizieren
            </button>
          )}
        </div>
      </div>

      {/* Tabs & Content */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-700">
          <nav className="flex overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600 dark:text-red-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Personal Data Tab */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Persönliche Daten
                </h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Bearbeiten
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsEditing(false)
                        setFormData({
                          name: user.name,
                          bio: user.bio || '',
                          email: user.email,
                          phone: user.phone || '',
                        })
                      }}
                      className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                    >
                      Abbrechen
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors disabled:opacity-50"
                    >
                      {isSaving ? 'Speichern...' : 'Speichern'}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Anzeigename
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => updateFormData({ name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors"
                    />
                  ) : (
                    <p className="px-4 py-3 text-slate-900 dark:text-white">{user.name}</p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Bio / Beschreibung
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.bio || ''}
                      onChange={(e) => updateFormData({ bio: e.target.value })}
                      rows={3}
                      placeholder="Erzähle etwas über dich..."
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors resize-none"
                    />
                  ) : (
                    <p className="px-4 py-3 text-slate-900 dark:text-white">
                      {user.bio || <span className="text-slate-400 italic">Keine Beschreibung</span>}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    E-Mail-Adresse
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => updateFormData({ email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors"
                    />
                  ) : (
                    <p className="px-4 py-3 text-slate-900 dark:text-white">{user.email}</p>
                  )}
                  {isEditing && (
                    <p className="mt-1 text-xs text-slate-400">
                      Eine Änderung erfordert eine erneute Verifizierung
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Telefonnummer (optional)
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => updateFormData({ phone: e.target.value })}
                      placeholder="+43 664 123 4567"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors"
                    />
                  ) : (
                    <p className="px-4 py-3 text-slate-900 dark:text-white">
                      {user.phone || <span className="text-slate-400 italic">Nicht angegeben</span>}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Address Tab */}
          {activeTab === 'address' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Adresse & Standort
              </h3>

              {user.address ? (
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                      <MapPinIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {user.address.street} {user.address.houseNumber}
                      </p>
                      <p className="text-slate-600 dark:text-slate-400">
                        {user.address.zip} {user.address.city}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-500">
                        {countries.find(c => c.code === user.address?.country)?.name || user.address.country}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPinIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400 mb-4">
                    Keine Adresse hinterlegt
                  </p>
                  <button className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                    Adresse hinzufügen
                  </button>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Standardstandort für Anzeigen
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Dieser Standort wird automatisch für neue Anzeigen verwendet.
                </p>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Benachrichtigungen
              </h3>

              <div className="space-y-4">
                {/* Email Notifications */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    E-Mail
                  </h4>

                  <NotificationToggle
                    label="Neue Nachrichten"
                    description="Benachrichtigung bei neuen Nachrichten von Käufern"
                    checked={formData.notificationSettings?.emailMessages ?? true}
                    onChange={(v) => updateNotifications('emailMessages', v)}
                  />

                  <NotificationToggle
                    label="Preisangebote"
                    description="Benachrichtigung bei neuen Gegenangeboten"
                    checked={formData.notificationSettings?.emailOffers ?? true}
                    onChange={(v) => updateNotifications('emailOffers', v)}
                  />

                  <NotificationToggle
                    label="Anzeigen-Updates"
                    description="Benachrichtigung wenn sich etwas an deinen Anzeigen ändert"
                    checked={formData.notificationSettings?.emailListingUpdates ?? false}
                    onChange={(v) => updateNotifications('emailListingUpdates', v)}
                  />

                  <NotificationToggle
                    label="Newsletter"
                    description="Neuigkeiten und Tipps von HELGUS"
                    checked={formData.notificationSettings?.newsletter ?? false}
                    onChange={(v) => updateNotifications('newsletter', v)}
                  />
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Push
                  </h4>

                  <NotificationToggle
                    label="Push-Benachrichtigungen"
                    description="Sofortige Benachrichtigungen im Browser"
                    checked={formData.notificationSettings?.pushEnabled ?? true}
                    onChange={(v) => updateNotifications('pushEnabled', v)}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onSaveProfile?.(formData)}
                  className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors"
                >
                  Einstellungen speichern
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Sicherheit
              </h3>

              {/* Password */}
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">Passwort</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Ändere dein Passwort regelmäßig für mehr Sicherheit
                    </p>
                  </div>
                  <button
                    onClick={onChangePassword}
                    className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-colors"
                  >
                    Ändern
                  </button>
                </div>
              </div>

              {/* Connected Accounts */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Verbundene Konten
                </h4>
                <div className="space-y-3">
                  {/* Google */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white dark:bg-slate-600 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Google</p>
                        {connectedAccounts.find(a => a.provider === 'google') ? (
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {connectedAccounts.find(a => a.provider === 'google')?.email}
                          </p>
                        ) : (
                          <p className="text-sm text-slate-400">Nicht verbunden</p>
                        )}
                      </div>
                    </div>
                    {connectedAccounts.find(a => a.provider === 'google') ? (
                      <button
                        onClick={() => {
                          const acc = connectedAccounts.find(a => a.provider === 'google')
                          if (acc) onDisconnectAccount?.(acc.id)
                        }}
                        className="text-sm text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400"
                      >
                        Trennen
                      </button>
                    ) : (
                      <button
                        onClick={() => onConnectAccount?.('google')}
                        className="text-sm font-medium text-red-600 dark:text-red-400"
                      >
                        Verbinden
                      </button>
                    )}
                  </div>

                  {/* Apple */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white dark:text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Apple</p>
                        {connectedAccounts.find(a => a.provider === 'apple') ? (
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {connectedAccounts.find(a => a.provider === 'apple')?.email}
                          </p>
                        ) : (
                          <p className="text-sm text-slate-400">Nicht verbunden</p>
                        )}
                      </div>
                    </div>
                    {connectedAccounts.find(a => a.provider === 'apple') ? (
                      <button
                        onClick={() => {
                          const acc = connectedAccounts.find(a => a.provider === 'apple')
                          if (acc) onDisconnectAccount?.(acc.id)
                        }}
                        className="text-sm text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400"
                      >
                        Trennen
                      </button>
                    ) : (
                      <button
                        onClick={() => onConnectAccount?.('apple')}
                        className="text-sm font-medium text-red-600 dark:text-red-400"
                      >
                        Verbinden
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Delete Account */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-3">
                  Gefahrenzone
                </h4>
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Konto löschen
                  </button>
                ) : (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <div className="flex items-start gap-3 mb-4">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-700 dark:text-red-400">
                          Bist du sicher?
                        </p>
                        <p className="text-sm text-red-600 dark:text-red-400/80 mt-1">
                          Diese Aktion kann nicht rückgängig gemacht werden. Alle deine Daten, Anzeigen und Nachrichten werden dauerhaft gelöscht.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                      >
                        Abbrechen
                      </button>
                      <button
                        onClick={onDeleteAccount}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors"
                      >
                        Ja, Konto löschen
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper component for notification toggles
interface NotificationToggleProps {
  label: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}

function NotificationToggle({ label, description, checked, onChange }: NotificationToggleProps) {
  return (
    <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
      <div>
        <p className="font-medium text-slate-900 dark:text-white">{label}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-checked:bg-red-500 rounded-full transition-colors"></div>
        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"></div>
      </div>
    </label>
  )
}

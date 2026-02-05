import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface EmailPrefs {
  new_message: boolean
  counter_offer: boolean
  counter_offer_accepted: boolean
  counter_offer_refused: boolean
  purchase_buyer: boolean
  purchase_seller: boolean
}

export function EmailPreferences() {
  const [preferences, setPreferences] = useState<EmailPrefs>({
    new_message: true,
    counter_offer: true,
    counter_offer_accepted: true,
    counter_offer_refused: true,
    purchase_buyer: true,
    purchase_seller: true,
  })
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Lade Präferenzen beim Mounting
  useEffect(() => {
    async function loadPreferences() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('email_preferences')
          .eq('id', user.id)
          .single()

        if (error) {
          // Wenn die Spalte nicht existiert, ist das ok - Migration nicht angewendet
          console.warn('[EmailPreferences] Spalte existiert möglicherweise noch nicht:', error.message)
        } else if (data !== null && typeof data === 'object' && 'email_preferences' in data) {
          const prefs = (data as any).email_preferences
          if (prefs && typeof prefs === 'object') {
            setPreferences(prefs)
          }
        }
      } catch (err) {
        console.error('[EmailPreferences] Exception beim Laden:', err)
      } finally {
        setLoading(false)
      }
    }

    loadPreferences()
  }, [])

  const updatePreference = async (key: keyof EmailPrefs, value: boolean) => {
    setIsSaving(true)

    const newPrefs = { ...preferences, [key]: value }
    setPreferences(newPrefs)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('profiles')
        .update({ email_preferences: newPrefs } as any)
        .eq('id', user.id)

      if (error) {
        console.warn('[EmailPreferences] Fehler beim Speichern:', error.message)
        // Wenn Migration nicht angewendet, ignorieren
        if (!error.message.includes('email_preferences')) {
          setPreferences(preferences)
        }
      }
    } catch (err) {
      console.error('[EmailPreferences] Exception beim Speichern:', err)
      setPreferences(preferences)
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          E-Mail-Benachrichtigungen
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Wähle welche Benachrichtigungen du per E-Mail erhalten möchtest
        </p>
      </div>

      <div className="space-y-0 divide-y divide-slate-200 dark:divide-slate-700">
        <PreferenceToggle
          label="Neue Nachrichten"
          description="Wenn jemand dir eine Nachricht zu deinem Produkt sendet"
          checked={preferences.new_message}
          onChange={(val) => updatePreference('new_message', val)}
          disabled={isSaving}
        />

        <PreferenceToggle
          label="Gegenangebote erhalten"
          description="Wenn jemand ein Gegenangebot für dein Produkt macht"
          checked={preferences.counter_offer}
          onChange={(val) => updatePreference('counter_offer', val)}
          disabled={isSaving}
        />

        <PreferenceToggle
          label="Gegenangebote angenommen"
          description="Wenn dein Gegenangebot angenommen wurde"
          checked={preferences.counter_offer_accepted}
          onChange={(val) => updatePreference('counter_offer_accepted', val)}
          disabled={isSaving}
        />

        <PreferenceToggle
          label="Gegenangebote abgelehnt"
          description="Wenn dein Gegenangebot abgelehnt wurde"
          checked={preferences.counter_offer_refused}
          onChange={(val) => updatePreference('counter_offer_refused', val)}
          disabled={isSaving}
        />

        <PreferenceToggle
          label="Kaufbestätigungen (Käufer)"
          description="Wenn du einen Artikel erfolgreich gekauft hast"
          checked={preferences.purchase_buyer}
          onChange={(val) => updatePreference('purchase_buyer', val)}
          disabled={isSaving}
        />

        <PreferenceToggle
          label="Verkaufsbenachrichtigungen (Verkäufer)"
          description="Wenn einer deiner Artikel verkauft wurde"
          checked={preferences.purchase_seller}
          onChange={(val) => updatePreference('purchase_seller', val)}
          disabled={isSaving}
        />
      </div>
    </div>
  )
}

interface PreferenceToggleProps {
  label: string
  description: string
  checked: boolean
  onChange: (val: boolean) => void
  disabled: boolean
}

function PreferenceToggle({
  label,
  description,
  checked,
  onChange,
  disabled,
}: PreferenceToggleProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex-1">
        <p className="font-medium text-slate-900 dark:text-white">{label}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
          checked ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
          aria-hidden="true"
        />
      </button>
    </div>
  )
}

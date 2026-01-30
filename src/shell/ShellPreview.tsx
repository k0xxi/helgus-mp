import React from 'react'
import { AppShell } from './components/AppShell'

export default function ShellPreview() {
  const navigationItems = [
    { label: 'Produktkatalog & Suche', href: '/catalog', isActive: true },
    { label: 'Produktdetails & Verhandlung', href: '/product-details' },
    { label: 'Verkäufer-Dashboard', href: '/dashboard' },
    { label: 'Nutzerverwaltung', href: '/profile' },
  ]

  const user = {
    name: 'Max Mustermann',
    avatarUrl: undefined,
    isSeller: true,
  }

  return (
    <AppShell
      navigationItems={navigationItems}
      user={user}
      onNavigate={(href) => console.log('Navigate to:', href)}
      onLogout={() => console.log('Logout')}
      notificationCount={3}
      favoritesCount={7}
      onCreateListing={() => console.log('Create new listing')}
      onNotificationsClick={() => console.log('View notifications')}
      onFavoritesClick={() => console.log('View favorites')}
      variant="public"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4 font-['DM_Sans']">
            HELGUS Marktplatz
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6 font-['Inter']">
            Willkommen im HELGUS Marktplatz! Hier wird der Inhalt der einzelnen Bereiche angezeigt.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
              <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2 font-['DM_Sans']">
                Primärfarbe: Rot
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 font-['Inter']">
                Für Buttons, CTAs und wichtige Aktionen
              </p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 font-['DM_Sans']">
                Sekundärfarbe: Blau
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 font-['Inter']">
                Für Links und unterstützende Elemente
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 font-['DM_Sans']">
                Neutral: Slate
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-['Inter']">
                Für Hintergründe, Texte und Strukturen
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 font-['DM_Sans']">
                Typografie
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-['Inter']">
                DM Sans für Überschriften, Inter für Fließtext
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 font-['DM_Sans']">
              Content Area
            </h3>
            <p className="text-slate-600 dark:text-slate-400 font-['Inter']">
              Die Inhalte der einzelnen Bereiche (Produktkatalog, Produktdetails, Dashboard, etc.)
              werden hier innerhalb der Shell angezeigt. Die Navigation bleibt dabei persistent.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

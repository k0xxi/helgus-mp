import React from 'react'
import { Search, Bell, Heart, Plus, Menu, Home, User as UserIcon } from 'lucide-react'
import { UserMenu } from './UserMenu'
import type { NavigationItem, User } from './AppShell'

interface MainNavProps {
  navigationItems: NavigationItem[]
  user?: User
  onNavigate?: (href: string) => void
  onLogout?: () => void
  notificationCount?: number
  favoritesCount?: number
  onCreateListing?: () => void
  onNotificationsClick?: () => void
  onFavoritesClick?: () => void
  variant?: 'public' | 'dashboard'
}

export function MainNav({
  navigationItems,
  user,
  onNavigate,
  onLogout,
  notificationCount = 0,
  favoritesCount = 0,
  onCreateListing,
  onNotificationsClick,
  onFavoritesClick,
  variant = 'public',
}: MainNavProps) {
  return (
    <>
      {/* Desktop & Tablet Navigation */}
      <nav className="hidden md:block bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <button
                onClick={() => onNavigate?.('/')}
                className="text-2xl font-bold text-red-600 dark:text-red-500 font-['DM_Sans']"
              >
                HELGUS
              </button>
            </div>

            {/* Right Icons & Actions */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button
                onClick={onNotificationsClick}
                className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                aria-label="Benachrichtigungen"
              >
                <Bell className="w-6 h-6" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>

              {/* Favorites */}
              <button
                onClick={onFavoritesClick}
                className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                aria-label="Favoriten"
              >
                <Heart className="w-6 h-6" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {favoritesCount > 9 ? '9+' : favoritesCount}
                  </span>
                )}
              </button>

              {/* Create Listing Button */}
              <button
                onClick={onCreateListing}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-lg transition-colors font-medium font-['DM_Sans']"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden lg:inline">Anzeige erstellen</span>
              </button>

              {/* User Menu */}
              {user && (
                <UserMenu user={user} onLogout={onLogout} onNavigate={onNavigate} />
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="px-4 py-3">
          <button
            onClick={() => onNavigate?.('/')}
            className="text-xl font-bold text-red-600 dark:text-red-500 font-['DM_Sans']"
          >
            HELGUS
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 z-50">
        <div className="flex items-center justify-around h-16 px-2">
          <button
            onClick={() => onNavigate?.('/')}
            className="flex flex-col items-center gap-1 p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-['Inter']">Home</span>
          </button>

          <button
            onClick={() => onNavigate?.('/search')}
            className="flex flex-col items-center gap-1 p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <Search className="w-6 h-6" />
            <span className="text-xs font-['Inter']">Suche</span>
          </button>

          <button
            onClick={onCreateListing}
            className="flex flex-col items-center gap-1 p-2 -mt-6 bg-red-600 dark:bg-red-500 text-white rounded-full w-14 h-14 shadow-lg"
          >
            <Plus className="w-8 h-8" />
          </button>

          <button
            onClick={onFavoritesClick}
            className="relative flex flex-col items-center gap-1 p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <Heart className="w-6 h-6" />
            <span className="text-xs font-['Inter']">Favoriten</span>
            {favoritesCount > 0 && (
              <span className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {favoritesCount > 9 ? '9+' : favoritesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate?.('/profile')}
            className="relative flex flex-col items-center gap-1 p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <UserIcon className="w-6 h-6" />
            <span className="text-xs font-['Inter']">Profil</span>
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Spacing */}
      <div className="md:hidden h-16" />
    </>
  )
}

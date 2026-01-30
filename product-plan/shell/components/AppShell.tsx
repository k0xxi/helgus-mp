import React from 'react'
import { MainNav } from './MainNav'

export interface NavigationItem {
  label: string
  href: string
  isActive?: boolean
}

export interface User {
  name: string
  avatarUrl?: string
  isSeller?: boolean
}

export interface AppShellProps {
  children: React.ReactNode
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

export function AppShell({
  children,
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
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <MainNav
        navigationItems={navigationItems}
        user={user}
        onNavigate={onNavigate}
        onLogout={onLogout}
        notificationCount={notificationCount}
        favoritesCount={favoritesCount}
        onCreateListing={onCreateListing}
        onNotificationsClick={onNotificationsClick}
        onFavoritesClick={onFavoritesClick}
        variant={variant}
      />

      <main className="w-full">
        {children}
      </main>
    </div>
  )
}

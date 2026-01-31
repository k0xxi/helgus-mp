import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/marketplace/context/AuthContext'
import { useConversationsQuery, useUserNotifications, useNotificationsSubscription } from '@/marketplace/hooks'
import { NotificationDropdown } from '@/marketplace/components/NotificationDropdown'
import {
  Home,
  Search,
  Heart,
  MessageCircle,
  PlusCircle,
  User,
  Bell,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState, useEffect } from 'react'

export function MarketplaceLayout() {
  const { user, profile, signOut, loading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false)
  const { data: conversations = [] } = useConversationsQuery(user?.id)
  const { notifications, unreadCount: unreadNotifications, markAsRead } = useUserNotifications(user?.id)

  // Set up real-time subscription for notifications
  useNotificationsSubscription(user?.id)

  // Calculate total unread messages
  const totalUnreadMessages = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0)

  const isActive = (path: string) => location.pathname === path

  const handleLogout = async () => {
    await signOut()
    navigate('/marketplace')
  }

  const handleSellClick = () => {
    if (!user) {
      navigate('/marketplace/auth')
      return
    }
    if (!profile?.isVerified) {
      navigate('/marketplace/profile/verification')
      return
    }
    navigate('/marketplace/sell')
  }

  const navItems = [
    { path: '/marketplace', icon: Home, label: 'Start' },
    { path: '/marketplace/search', icon: Search, label: 'Suchen' },
    { path: '/marketplace/favorites', icon: Heart, label: 'Favoriten', auth: true },
    { path: '/marketplace/messages', icon: MessageCircle, label: 'Nachrichten', auth: true },
  ]

  const filteredNavItems = navItems.filter((item) => !item.auth || user)

  return (
    <div className="marketplace-theme min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* Logo */}
          <Link to="/marketplace" className="flex items-center gap-2 cursor-pointer">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white font-bold">
              H
            </div>
            <span className="text-lg font-semibold text-slate-900 dark:text-white">
              HELGUS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {filteredNavItems.map((item) => (
              <div key={item.path} className="relative">
                <Link
                  to={item.path}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    isActive(item.path)
                      ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
                {item.path === '/marketplace/messages' && totalUnreadMessages > 0 && (
                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-medium text-white bg-red-600 rounded-full">
                    {totalUnreadMessages}
                  </span>
                )}
              </div>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <button
                  onClick={handleSellClick}
                  className="hidden items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 sm:flex cursor-pointer"
                >
                  <PlusCircle className="h-4 w-4" />
                  Verkaufen
                </button>
                <div className="relative">
                  <button
                    onClick={() => {
                      if (unreadNotifications > 0) {
                        setNotificationDropdownOpen(!notificationDropdownOpen)
                      } else {
                        navigate('/marketplace/notifications')
                      }
                    }}
                    className="relative rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-medium text-white bg-red-600 rounded-full">
                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                      </span>
                    )}
                  </button>
                  {user && notificationDropdownOpen && unreadNotifications > 0 && (
                    <NotificationDropdown
                      notifications={notifications}
                      onClose={() => setNotificationDropdownOpen(false)}
                      onMarkAsRead={markAsRead}
                    />
                  )}
                </div>
                <Link
                  to="/marketplace/profile"
                  className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <User className="h-5 w-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 md:block cursor-pointer"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/marketplace/auth"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Anmelden
                </Link>
                <Link
                  to="/marketplace/auth?mode=register"
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 cursor-pointer"
                >
                  Registrieren
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 md:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="border-t border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 md:hidden">
            <div className="flex flex-col gap-1">
              {filteredNavItems.map((item) => (
                <div key={item.path} className="relative">
                  <Link
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                      isActive(item.path)
                        ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                  {item.path === '/marketplace/messages' && totalUnreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-medium text-white bg-red-600 rounded-full">
                      {totalUnreadMessages}
                    </span>
                  )}
                </div>
              ))}
              {user && (
                <>
                  <Link
                    to="/marketplace/sell"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    <PlusCircle className="h-5 w-5" />
                    Verkaufen
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    <LogOut className="h-5 w-5" />
                    Abmelden
                  </button>
                </>
              )}
            </div>
          </nav>
        )}
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
          </div>
        ) : (
          <Outlet />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-600 dark:text-slate-400 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-red-600 text-xs font-bold text-white">
                H
              </div>
              <span>HELGUS Marktplatz</span>
            </div>
            <div className="flex gap-6">
              <Link to="/marketplace/impressum" className="hover:text-slate-900 dark:hover:text-white cursor-pointer">
                Impressum
              </Link>
              <Link to="/marketplace/datenschutz" className="hover:text-slate-900 dark:hover:text-white cursor-pointer">
                Datenschutz
              </Link>
              <Link to="/marketplace/agb" className="hover:text-slate-900 dark:hover:text-white cursor-pointer">
                AGB
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

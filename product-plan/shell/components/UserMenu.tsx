import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, LayoutDashboard, Package, Settings, LogOut, User as UserIcon } from 'lucide-react'
import type { User } from './AppShell'

interface UserMenuProps {
  user: User
  onLogout?: () => void
  onNavigate?: (href: string) => void
}

export function UserMenu({ user, onLogout, onNavigate }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleMenuItemClick = (href: string) => {
    setIsOpen(false)
    onNavigate?.(href)
  }

  const handleLogout = () => {
    setIsOpen(false)
    onLogout?.()
  }

  // Generate initials from name
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-red-600 dark:bg-red-500 text-white flex items-center justify-center font-medium font-['DM_Sans']">
            {initials}
          </div>
        )}
        <span className="hidden lg:inline text-sm font-medium text-slate-900 dark:text-slate-100 font-['Inter']">
          {user.name}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-600 dark:text-slate-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* User Info */}
          <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 font-['DM_Sans']">
              {user.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-['Inter']">
              {user.isSeller ? 'Verifizierter Verkäufer' : 'Käufer'}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {user.isSeller && (
              <button
                onClick={() => handleMenuItemClick('/dashboard')}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-['Inter']"
              >
                <LayoutDashboard className="w-4 h-4" />
                Mein Dashboard
              </button>
            )}

            <button
              onClick={() => handleMenuItemClick('/my-listings')}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-['Inter']"
            >
              <Package className="w-4 h-4" />
              Meine Anzeigen
            </button>

            <button
              onClick={() => handleMenuItemClick('/profile')}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-['Inter']"
            >
              <Settings className="w-4 h-4" />
              Profil & Einstellungen
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors font-['Inter']"
            >
              <LogOut className="w-4 h-4" />
              Abmelden
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

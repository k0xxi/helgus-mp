import { useEffect, useRef } from 'react'
import { Bell, MessageSquare, TrendingUp, Check, X, TrendingDown, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Notification } from '@/types/marketplace'

interface NotificationDropdownProps {
  notifications: Notification[]
  onClose: () => void
  onMarkAsRead: (notificationId: string) => Promise<void>
}

export function NotificationDropdown({
  notifications,
  onClose,
  onMarkAsRead,
}: NotificationDropdownProps) {
  const navigate = useNavigate()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter to only unread notifications
  const unreadNotifications = notifications.filter((n) => !n.isRead)

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_message':
        return <MessageSquare className="h-5 w-5 text-blue-600" />
      case 'offer_received':
        return <TrendingUp className="h-5 w-5 text-amber-600" />
      case 'offer_accepted':
        return <Check className="h-5 w-5 text-green-600" />
      case 'offer_declined':
        return <X className="h-5 w-5 text-red-600" />
      case 'price_drop':
        return <TrendingDown className="h-5 w-5 text-emerald-600" />
      default:
        return <Bell className="h-5 w-5 text-slate-600" />
    }
  }

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'new_message':
        return 'Neue Nachricht'
      case 'offer_received':
        return 'Gegenangebot erhalten'
      case 'offer_accepted':
        return 'Gegenangebot akzeptiert'
      case 'offer_declined':
        return 'Gegenangebot abgelehnt'
      case 'price_drop':
        return 'Preisfall'
      default:
        return 'Benachrichtigung'
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'gerade eben'
    if (diffMins < 60) return `vor ${diffMins}m`
    if (diffHours < 24) return `vor ${diffHours}h`
    if (diffDays < 7) return `vor ${diffDays}d`
    return date.toLocaleDateString('de-DE')
  }

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    await onMarkAsRead(notification.id)

    // Close dropdown
    onClose()

    // Navigate to product (offer/message notifications)
    if (notification.productId) {
      navigate(`/marketplace/product/${notification.productId}`)
    }
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-96 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800 z-50"
    >
      {unreadNotifications.length === 0 ? (
        <div className="p-4 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">Keine neuen Benachrichtigungen</p>
        </div>
      ) : (
        <>
          <div className="max-h-[400px] overflow-y-auto">
            {unreadNotifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className="w-full border-b border-slate-100 p-4 text-left transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50 last:border-b-0"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {getNotificationTypeLabel(notification.type)}
                    </p>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 truncate">
                      {notification.message}
                    </p>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                      {formatTime(notification.createdAt)}
                    </p>
                  </div>

                  {/* Unread indicator */}
                  <div className="flex-shrink-0 h-2 w-2 rounded-full bg-blue-500 mt-1" />
                </div>
              </button>
            ))}
          </div>

          {/* View all link */}
          <div className="border-t border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-700/50">
            <button
              onClick={() => {
                onClose()
                navigate('/marketplace/notifications')
              }}
              className="flex items-center justify-center gap-2 w-full text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              Alle anzeigen
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </div>
  )
}

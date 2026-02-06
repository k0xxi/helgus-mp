import { Bell, MessageSquare, TrendingUp, Check, X, TrendingDown, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/marketplace/context/AuthContext'
import { useUserNotifications, useDeleteNotificationMutation } from '@/marketplace/hooks'
import { useNavigate } from 'react-router-dom'
import { DeleteConfirmModal } from '@/marketplace/components/DeleteConfirmModal'
import { AlertDialog } from '@/marketplace/components/AlertDialog'
import type { Notification } from '@/types/marketplace'

export function NotificationsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { notifications, isLoading, markAsRead, markAllAsRead } = useUserNotifications(user?.id)
  const deleteNotificationMutation = useDeleteNotificationMutation()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleNotificationClick = async (notificationId: string, productId: string | null, type: string) => {
    // Mark as read
    await markAsRead(notificationId)

    // Navigate based on type
    if (type === 'offer_received' || type === 'offer_accepted' || type === 'offer_declined') {
      if (productId) {
        navigate(`/product/${productId}#gegenangebote`)
      }
    } else if (type === 'new_message') {
      if (productId) {
        navigate(`/product/${productId}?openChat=true`)
      }
    } else if (type === 'price_drop') {
      if (productId) {
        navigate(`/product/${productId}`)
      }
    }
  }

  const handleDeleteClick = (notification: Notification, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedNotification(notification)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedNotification) return

    setIsDeleting(true)
    try {
      await deleteNotificationMutation.mutateAsync(selectedNotification.id)
      setDeleteModalOpen(false)
      setSelectedNotification(null)
    } catch (error) {
      console.error('Error deleting notification:', error)
      setErrorMessage('Fehler beim Löschen der Benachrichtigung. Bitte versuchen Sie es später erneut.')
    } finally {
      setIsDeleting(false)
    }
  }

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-slate-800 dark:to-slate-900 rounded-lg px-6 py-8 border border-red-100 dark:border-red-900/30">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-red-600 dark:text-red-500" />
            <span className="text-sm font-semibold text-red-600 dark:text-red-500">System</span>
          </div>
          {notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 cursor-pointer"
            >
              Alle gelesen
            </button>
          )}
        </div>
        <div className="mb-3">
          <h1 className="text-[2rem] font-bold text-slate-900 dark:text-white">
            <span className="text-red-600 dark:text-red-500">Benachrichtigungen</span>
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
          Bleiben Sie über neue Nachrichten, Angebote und Ihre Artikel informiert.
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
          <Bell className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
          <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">
            Keine Benachrichtigungen
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Sie haben keine neuen Benachrichtigungen.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex gap-2 items-stretch group">
              <button
                onClick={() =>
                  handleNotificationClick(
                    notification.id,
                    notification.productId,
                    notification.type
                  )
                }
                className={`flex-1 rounded-lg border p-4 text-left transition-colors cursor-pointer ${
                  notification.isRead
                    ? 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700'
                    : 'border-blue-200 bg-blue-50 hover:bg-blue-100 dark:border-blue-900/30 dark:bg-blue-900/10 dark:hover:bg-blue-900/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-medium ${
                        notification.isRead
                          ? 'text-slate-900 dark:text-white'
                          : 'text-blue-900 dark:text-blue-100 font-semibold'
                      }`}
                    >
                      {notification.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 truncate">
                      {notification.message}
                    </p>
                  </div>

                  {/* Timestamp */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      {formatTime(notification.createdAt)}
                    </p>
                    {!notification.isRead && (
                      <div className="mt-2 h-2 w-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                </div>
              </button>

              {/* Delete Button */}
              <button
                onClick={(e) => handleDeleteClick(notification, e)}
                className="flex items-center justify-center px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900/30 transition-colors cursor-pointer"
                title="Benachrichtigung löschen"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Benachrichtigung löschen"
        message="Diese Benachrichtigung wird dauerhaft gelöscht:"
        itemName={selectedNotification?.title || 'Benachrichtigung'}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false)
          setSelectedNotification(null)
        }}
      />

      {/* Error Dialog */}
      <AlertDialog
        isOpen={!!errorMessage}
        title="Fehler"
        message={errorMessage || ''}
        onClose={() => setErrorMessage(null)}
        variant="error"
      />
    </div>
  )
}

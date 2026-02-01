import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Notification } from '@/types/marketplace'

// Query key factory for notifications
const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (userId: string | undefined) => [...notificationKeys.lists(), userId] as const,
}

interface UseNotificationsResult {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  error: Error | null
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  refetch: () => Promise<void>
}

export function useNotifications(userId: string | undefined): UseNotificationsResult {
  const queryClient = useQueryClient()

  // Fetch notifications using React Query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: notificationKeys.list(userId),
    queryFn: async () => {
      if (!userId) return []

      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select(
          `
          id,
          type,
          title,
          message,
          product_id,
          is_read,
          created_at,
          products(title)
        `
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (fetchError) throw fetchError

      return ((data || []) as unknown as {
        id: string
        type: Notification['type']
        title: string
        message: string
        product_id: string | null
        is_read: boolean
        created_at: string
        products: { title: string } | null
      }[]).map((notif) => ({
        id: notif.id,
        userId: userId,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        productId: notif.product_id,
        isRead: notif.is_read,
        createdAt: new Date(notif.created_at),
      }))
    },
    enabled: !!userId,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // Fallback: refetch every 60 seconds if subscriptions fail
  })

  // Mark single notification as read
  const { mutateAsync: markAsReadAsync } = useMutation({
    mutationFn: async (notificationId: string) => {
      if (!userId) return

      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', userId)
    },
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({
        queryKey: notificationKeys.list(userId),
      })
    },
  })

  // Mark all notifications as read
  const { mutateAsync: markAllAsReadAsync } = useMutation({
    mutationFn: async () => {
      if (!userId) return

      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false)
    },
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({
        queryKey: notificationKeys.list(userId),
      })
    },
  })

  const notifications = data || []
  const unreadCount = notifications.filter((n) => !n.isRead).length

  return {
    notifications,
    unreadCount,
    isLoading,
    error: error as Error | null,
    markAsRead: markAsReadAsync,
    markAllAsRead: markAllAsReadAsync,
    refetch: () => refetch().then(() => undefined),
  }
}

// Export with both names for compatibility
export const useUserNotifications = useNotifications

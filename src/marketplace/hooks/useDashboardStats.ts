import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface MonthlyData {
  month: string
  sales: number
  revenue: number
}

export interface DashboardStats {
  activeListings: number
  totalViews: number
  pendingOffers: number
  soldThisMonth: number
  monthlySales: MonthlyData[]
  monthlyRevenue: MonthlyData[]
}

interface UseDashboardStatsResult {
  stats: DashboardStats | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useDashboardStats(userId: string | undefined): UseDashboardStatsResult {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchStats = useCallback(async () => {
    if (!userId) {
      setStats(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // 1. Get all products for this seller (including price for revenue calculation)
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, view_count, is_active, sold_at, price')
        .eq('seller_id', userId)

      if (productsError) {
        throw productsError
      }

      const products = (productsData || []) as Array<{
        id: string
        view_count: number
        is_active: boolean
        sold_at: string | null
        price: number
      }>

      // Calculate active listings count
      const activeListings = products.filter((p) => p.is_active).length

      // Calculate total views sum
      const totalViews = products.reduce((sum, p) => sum + (p.view_count || 0), 0)

      // Calculate sold this month
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const soldThisMonth = products.filter((p) => {
        if (!p.sold_at) return false
        const soldDate = new Date(p.sold_at)
        return soldDate >= monthStart && soldDate <= now
      }).length

      // 2. Get pending offers count
      // Pending offers are conversations for products owned by this user where the conversation still exists
      // (implying negotiation is ongoing)
      const { count: pendingOffersCount, error: offersError } = await supabase
        .from('conversations')
        .select('id', { count: 'exact', head: true })
        .eq('seller_id', userId)

      if (offersError) {
        throw offersError
      }

      const pendingOffers = pendingOffersCount || 0

      // 3. Calculate monthly sales and revenue
      const monthNames = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
      const currentYear = new Date().getFullYear()

      const monthlyData: Record<number, { sales: number; revenue: number }> = {}

      // Initialize all months with 0
      for (let i = 0; i < 12; i++) {
        monthlyData[i] = { sales: 0, revenue: 0 }
      }

      // Aggregate sold products by month
      products.forEach((product) => {
        if (product.sold_at) {
          const soldDate = new Date(product.sold_at)
          // Only count products sold in the current year
          if (soldDate.getFullYear() === currentYear) {
            const month = soldDate.getMonth()
            monthlyData[month].sales += 1
            monthlyData[month].revenue += product.price
          }
        }
      })

      // Convert to array format for charts
      const monthlySalesData: MonthlyData[] = monthNames.map((month, index) => ({
        month,
        sales: monthlyData[index].sales,
        revenue: monthlyData[index].revenue,
      }))

      const monthlyRevenueData: MonthlyData[] = monthNames.map((month, index) => ({
        month,
        sales: monthlyData[index].sales,
        revenue: monthlyData[index].revenue,
      }))

      setStats({
        activeListings,
        totalViews,
        pendingOffers,
        soldThisMonth,
        monthlySales: monthlySalesData,
        monthlyRevenue: monthlyRevenueData,
      })
    } catch (err) {
      const error = err as Error
      console.error('Error fetching dashboard stats:', error)
      setError(error)
      setStats(null)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return { stats, loading, error, refetch: fetchStats }
}

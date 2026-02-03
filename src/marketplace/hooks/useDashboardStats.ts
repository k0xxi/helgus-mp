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

      // 2. Get pending purchases count (pending sales)
      const { count: pendingPurchasesCount, error: pendingError } = await supabase
        .from('purchases')
        .select('id', { count: 'exact', head: true })
        .eq('seller_id', userId)
        .eq('status', 'pending')

      if (pendingError) {
        throw pendingError
      }

      const pendingOffers = pendingPurchasesCount || 0

      // 3. Get completed purchases for stats
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

      const { data: purchasesData, error: purchasesError } = await supabase
        .from('purchases')
        .select('price_at_purchase, completed_at')
        .eq('seller_id', userId)
        .eq('status', 'completed')
        .gte('completed_at', monthStart.toISOString())
        .lte('completed_at', now.toISOString())

      if (purchasesError) {
        throw purchasesError
      }

      // Calculate sold this month from purchases
      const soldThisMonth = (purchasesData || []).length

      // 4. Calculate monthly sales and revenue
      const monthNames = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
      const currentYear = new Date().getFullYear()

      const monthlyData: Record<number, { sales: number; revenue: number }> = {}

      // Initialize all months with 0
      for (let i = 0; i < 12; i++) {
        monthlyData[i] = { sales: 0, revenue: 0 }
      }

      // Fetch all completed purchases for the year
      const { data: yearPurchasesData, error: yearPurchasesError } = await supabase
        .from('purchases')
        .select('price_at_purchase, completed_at')
        .eq('seller_id', userId)
        .eq('status', 'completed')
        .gte('completed_at', `${currentYear}-01-01`)
        .lte('completed_at', `${currentYear}-12-31`)

      if (yearPurchasesError) {
        throw yearPurchasesError
      }

      // Aggregate completed purchases by month
      (yearPurchasesData || []).forEach((purchase) => {
        if (purchase.completed_at) {
          const completedDate = new Date(purchase.completed_at)
          const month = completedDate.getMonth()
          monthlyData[month].sales += 1
          monthlyData[month].revenue += Number(purchase.price_at_purchase)
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

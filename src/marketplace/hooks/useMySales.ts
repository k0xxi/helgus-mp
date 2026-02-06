import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface SaleProduct {
  id: string
  title: string
  price: number
  buyerId: string
  buyerName: string
  buyerCity?: string
  buyerImage?: string
  pendingSince: string
  soldAt?: string
  status: 'pending' | 'sold'
  productImage?: string
  shippingMethod?: 'Abholung' | 'Versand'
}

interface UseMySalesResult {
  sales: SaleProduct[]
  loading: boolean
  error: Error | null
  refetch: () => void
}

export function useMySales(userId: string | undefined): UseMySalesResult {
  const [sales, setSales] = useState<SaleProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSales = async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Fetch purchases with product and buyer info
      const { data: purchases, error: purchasesError } = await supabase
        .from('purchases')
        .select(`
          id,
          product_id,
          buyer_id,
          price_at_purchase,
          shipping_method,
          status,
          products(id, title, pending_since, sold_at, product_images(storage_path)),
          buyer:profiles!buyer_id(id, name, city, avatar_url)
        `)
        .eq('seller_id', userId)
        .order('purchased_at', { ascending: false })

      if (purchasesError) throw purchasesError

      // Transform purchases to sales
      const transformedSales: SaleProduct[] = (purchases || []).map(purchase => {
        const product = purchase.products as any
        const buyer = purchase.buyer as any
        return {
          id: purchase.product_id,
          title: product?.title || 'Unbekanntes Produkt',
          price: purchase.price_at_purchase,
          buyerId: purchase.buyer_id,
          buyerName: buyer?.name || 'Unbekannter Käufer',
          buyerCity: buyer?.city,
          buyerImage: buyer?.avatar_url,
          pendingSince: product?.pending_since,
          soldAt: product?.sold_at,
          status: purchase.status === 'completed' || product?.sold_at ? 'sold' : 'pending',
          productImage: product?.product_images?.[0]?.storage_path,
          shippingMethod: purchase.shipping_method as 'Abholung' | 'Versand' | undefined
        }
      })

      setSales(transformedSales)
    } catch (err) {
      console.error('Error fetching sales:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSales()
  }, [userId])

  return { sales, loading, error, refetch: fetchSales }
}

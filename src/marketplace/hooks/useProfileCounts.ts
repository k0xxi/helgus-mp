import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface ProfileCounts {
  listingCount: number
  purchaseCount: number
  salesCount: number
}

export function useProfileCounts(userId: string | undefined) {
  const [counts, setCounts] = useState<ProfileCounts>({
    listingCount: 0,
    purchaseCount: 0,
    salesCount: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchCounts = async () => {
      try {
        // Fetch listing count (only active products)
        const { count: listingCount, error: listingError } = await supabase
          .from('products')
          .select('id', { count: 'exact', head: true })
          .eq('seller_id', userId)
          .eq('is_active', true)
          .is('sold_at', null)
          .is('pending_since', null)

        // Fetch purchase count
        const { count: purchaseCount, error: purchaseError } = await supabase
          .from('purchases')
          .select('id', { count: 'exact', head: true })
          .eq('buyer_id', userId)

        // Fetch sales count (pending products)
        const { count: salesCount, error: salesError } = await supabase
          .from('products')
          .select('id', { count: 'exact', head: true })
          .eq('seller_id', userId)
          .not('pending_since', 'is', null)

        if (listingError) {
          console.error('Error fetching listing count:', listingError)
        }
        if (purchaseError) {
          console.error('Error fetching purchase count:', purchaseError)
        }
        if (salesError) {
          console.error('Error fetching sales count:', salesError)
        }

        setCounts({
          listingCount: listingCount ?? 0,
          purchaseCount: purchaseCount ?? 0,
          salesCount: salesCount ?? 0
        })
      } catch (error) {
        console.error('Error fetching profile counts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCounts()
  }, [userId])

  return { ...counts, loading }
}

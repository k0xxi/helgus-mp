import { useCallback } from 'react'
import { supabase } from '@/lib/supabase'

// =============================================================================
// usePurchase - Handle product purchases and transactions
// =============================================================================

interface UsePurchaseResult {
  createDirectPurchase: (productId: string, sellerId: string, price: number, shippingMethod: 'Abholung' | 'Versand') => Promise<{ error: Error | null }>
}

export function usePurchase(userId: string | undefined): UsePurchaseResult {
  const createDirectPurchase = useCallback(
    async (productId: string, sellerId: string, price: number, shippingMethod: 'Abholung' | 'Versand'): Promise<{ error: Error | null }> => {
      if (!userId) {
        return { error: new Error('Not authenticated') }
      }

      try {
        // Call server-side function to handle all purchase operations atomically
        const { data, error: rpcError } = await supabase.rpc('create_direct_purchase', {
          p_product_id: productId,
          p_seller_id: sellerId,
          p_buyer_id: userId,
          p_price: price,
          p_shipping_method: shippingMethod
        })

        if (rpcError) {
          console.error('RPC error in create_direct_purchase:', rpcError)
          throw rpcError
        }

        if (data && !(data as any).success) {
          throw new Error((data as any).error || 'Failed to create purchase')
        }

        console.log('Purchase created successfully:', data)

        return { error: null }
      } catch (err) {
        console.error('Error creating direct purchase:', err)
        return { error: err as Error }
      }
    },
    [userId]
  )

  return { createDirectPurchase }
}

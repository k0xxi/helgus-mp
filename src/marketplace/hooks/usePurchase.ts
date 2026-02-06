import { useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { sendEmail } from '@/lib/email'

// Helper: Create notification
async function createNotification(params: {
  userId: string
  type: 'purchase_completed'
  title: string
  message: string
  productId?: string
}): Promise<void> {
  if (!params.userId) {
    console.warn('[Notifications] Cannot create notification: userId is missing')
    return
  }

  try {
    const rpcParams = {
      p_user_id: params.userId,
      p_type: params.type,
      p_title: params.title,
      p_message: params.message,
    }

    if (params.productId) {
      ;(rpcParams as any).p_product_id = params.productId
    }

    const { data, error } = await supabase.rpc('create_notification', rpcParams as never)

    if (error) {
      console.error('[Notifications] RPC error:', error)
      return
    }

    console.log('[Notifications] Created notification:', data)
  } catch (err) {
    console.error('[Notifications] Error creating notification:', err)
  }
}

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

        // Create notification for seller
        await createNotification({
          userId: sellerId,
          type: 'purchase_completed',
          title: '🎉 Neuer Verkauf',
          message: 'Ein Produkt wurde gerade gekauft.',
          productId: productId
        })

        // Fetch product and seller/buyer details for email
        try {
          const { data: product } = await supabase
            .from('products')
            .select('id, title, price')
            .eq('id', productId)
            .single()

          const { data: seller } = await supabase
            .from('profiles')
            .select('name, email')
            .eq('id', sellerId)
            .single()

          const { data: buyer } = await supabase
            .from('profiles')
            .select('name, email')
            .eq('id', userId)
            .single()

          if (product && seller && (seller as any).email && buyer && (buyer as any).email) {
            console.log('[usePurchase] Sending emails...')

            // Send email to seller (purchase_seller)
            await sendEmail({
              type: 'purchase_seller',
              to: (seller as any).email,
              productTitle: product.title,
              productId: productId,
              productPrice: price,
              sellerName: seller.name || 'Verkäufer',
              buyerName: buyer.name || 'Ein Käufer',
            })

            // Send email to buyer (purchase_buyer)
            await sendEmail({
              type: 'purchase_buyer',
              to: (buyer as any).email,
              productTitle: product.title,
              productId: productId,
              productPrice: price,
              buyerName: buyer.name || 'Ein Käufer',
            })

            console.log('[usePurchase] Emails sent to seller and buyer')
          } else {
            console.warn('[usePurchase] Cannot send emails - missing data', {
              product: !!product,
              sellerEmail: !!(seller as any)?.email,
              buyerEmail: !!(buyer as any)?.email,
            })
          }
        } catch (emailErr) {
          console.error('[usePurchase] Email sending failed (non-blocking):', emailErr)
          // Don't throw - email sending is fire-and-forget
        }

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

import { supabase } from '@/lib/supabase'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

export interface SendEmailParams {
  type: 'new_message' | 'counter_offer' | 'counter_offer_accepted' |
        'counter_offer_refused' | 'purchase_buyer' | 'purchase_seller'
  to: string
  productTitle: string
  productId: string
  buyerName?: string
  sellerName?: string
  message?: string
  counterOffer?: number
  offerAmount?: number
  productPrice?: number
  buyerEmail?: string
}

/**
 * Sendet E-Mail via Supabase Edge Function
 * Fire-and-forget: Fehler werden geloggt, aber nicht geworfen
 * E-Mail-Fehler blockieren keine User-Aktionen
 */
export async function sendEmail(params: SendEmailParams): Promise<void> {
  try {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      console.warn('[Email] Keine Session - E-Mail wird übersprungen')
      return
    }

    console.log('[Email] Sending email:', { type: params.type, to: params.to })

    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/send-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(params),
      }
    )

    console.log('[Email] Response status:', response.status)

    if (!response.ok) {
      const error = await response.text()
      console.error('[Email] Fehler beim Senden:', { status: response.status, error })
      try {
        const errorJson = JSON.parse(error)
        console.error('[Email] Error details:', errorJson)
      } catch {
        // Response is not JSON
      }
    } else {
      const result = await response.json()
      console.log('[Email] Erfolgreich gesendet:', { type: params.type, id: result.id })
    }
  } catch (err) {
    console.error('[Email] Exception:', err)
    // Fehler nicht werfen - E-Mail-Fehler sollen App nicht blockieren
  }
}

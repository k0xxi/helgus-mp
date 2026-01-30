import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { PublicProfile, SellerVerification } from '@/types/marketplace'
import type { Tables } from '@/types/database'

// =============================================================================
// usePublicProfile - Fetch public profile by user ID
// =============================================================================

interface UsePublicProfileResult {
  profile: PublicProfile | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function usePublicProfile(userId: string | undefined): UsePublicProfileResult {
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      setProfile(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) {
        throw profileError
      }

      // Fetch listings count
      const { count: listingsCount, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', userId)
        .eq('is_active', true)

      if (countError) {
        console.error('Error fetching listings count:', countError)
      }

      const publicProfile: PublicProfile = {
        id: profileData.id,
        name: profileData.name,
        avatarUrl: profileData.avatar_url,
        bio: profileData.bio,
        city: profileData.city,
        country: profileData.country,
        isVerified: profileData.is_verified,
        memberSince: new Date(profileData.created_at),
        listingsCount: listingsCount ?? 0,
        responseTime: null, // Could be calculated from messages later
      }

      setProfile(publicProfile)
    } catch (err) {
      setError(err as Error)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return { profile, loading, error, refetch: fetchProfile }
}

// =============================================================================
// useSellerVerification - Get and submit seller verification
// =============================================================================

interface SellerVerificationInput {
  fullName: string
  street: string
  houseNumber: string
  zip: string
  city: string
  country: string
  iban: string
  bic?: string
  acceptedTerms: boolean
}

interface UseSellerVerificationResult {
  verification: SellerVerification | null
  loading: boolean
  error: Error | null
  submitVerification: (data: SellerVerificationInput) => Promise<{ error: Error | null }>
  refetch: () => Promise<void>
}

export function useSellerVerification(userId: string | undefined): UseSellerVerificationResult {
  const [verification, setVerification] = useState<SellerVerification | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchVerification = useCallback(async () => {
    if (!userId) {
      setVerification(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('seller_verifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 = no rows returned, which is expected if not verified
        throw fetchError
      }

      if (data) {
        setVerification(mapDbVerificationToVerification(data))
      } else {
        setVerification(null)
      }
    } catch (err) {
      setError(err as Error)
      setVerification(null)
    } finally {
      setLoading(false)
    }
  }, [userId])

  const submitVerification = async (
    data: SellerVerificationInput
  ): Promise<{ error: Error | null }> => {
    if (!userId) {
      return { error: new Error('Not authenticated') }
    }

    try {
      const { error: insertError } = await supabase.from('seller_verifications').insert({
        user_id: userId,
        full_name: data.fullName,
        street: data.street,
        house_number: data.houseNumber,
        zip: data.zip,
        city: data.city,
        country: data.country,
        iban: data.iban,
        bic: data.bic || null,
        accepted_terms: data.acceptedTerms,
        status: 'pending',
      })

      if (insertError) {
        return { error: insertError }
      }

      // Refetch after successful submission
      await fetchVerification()
      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }

  useEffect(() => {
    fetchVerification()
  }, [fetchVerification])

  return {
    verification,
    loading,
    error,
    submitVerification,
    refetch: fetchVerification,
  }
}

// =============================================================================
// useUserListings - Fetch user's listings for public profile
// =============================================================================

interface UserListing {
  id: string
  title: string
  price: number
  image: string
  location: {
    city: string
    country: string
  }
  condition: string
  createdAt: string
}

interface UseUserListingsResult {
  listings: UserListing[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useUserListings(userId: string | undefined): UseUserListingsResult {
  const [listings, setListings] = useState<UserListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchListings = useCallback(async () => {
    if (!userId) {
      setListings([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select(
          `
          id,
          title,
          price,
          city,
          condition,
          created_at,
          product_images!inner(storage_path, sort_order)
        `
        )
        .eq('seller_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20)

      if (productsError) {
        throw productsError
      }

      // Get profile for country
      const { data: profileData } = await supabase
        .from('profiles')
        .select('country')
        .eq('id', userId)
        .single()

      const country = profileData?.country ?? 'AT'

      const userListings: UserListing[] = (products || []).map((product) => {
        // Find the first image (lowest sort_order)
        const images = product.product_images as { storage_path: string; sort_order: number }[]
        const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order)
        const firstImage = sortedImages[0]

        const imageUrl = firstImage
          ? supabase.storage.from('products').getPublicUrl(firstImage.storage_path).data.publicUrl
          : '/placeholder-product.jpg'

        return {
          id: product.id,
          title: product.title,
          price: product.price,
          image: imageUrl,
          location: {
            city: product.city,
            country,
          },
          condition: product.condition,
          createdAt: product.created_at,
        }
      })

      setListings(userListings)
    } catch (err) {
      setError(err as Error)
      setListings([])
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  return { listings, loading, error, refetch: fetchListings }
}

// =============================================================================
// Helper Functions
// =============================================================================

function mapDbVerificationToVerification(data: Tables<'seller_verifications'>): SellerVerification {
  return {
    id: data.id,
    userId: data.user_id,
    fullName: data.full_name,
    street: data.street,
    houseNumber: data.house_number,
    zip: data.zip,
    city: data.city,
    country: data.country,
    iban: data.iban,
    bic: data.bic,
    acceptedTerms: data.accepted_terms,
    status: data.status,
    createdAt: new Date(data.created_at),
  }
}

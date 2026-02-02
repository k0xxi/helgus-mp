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
        status: 'verified',
      })

      if (insertError) {
        return { error: insertError }
      }

      // Set profile as verified
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_verified: true })
        .eq('id', userId)

      if (profileError) {
        console.error('Error updating profile verification:', profileError)
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
// useMyListings - Fetch and manage user's own listings (all statuses)
// =============================================================================

export type ListingStatus = 'active' | 'paused' | 'sold'

export interface MyListing {
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
  status: ListingStatus
  viewCount: number
  isActive: boolean
  soldAt: string | null
}

interface UseMyListingsResult {
  listings: MyListing[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
  togglePause: (listingId: string) => Promise<{ error: Error | null }>
  markAsSold: (listingId: string) => Promise<{ error: Error | null }>
  deleteListing: (listingId: string) => Promise<{ error: Error | null }>
}

export function useMyListings(userId: string | undefined): UseMyListingsResult {
  const [listings, setListings] = useState<MyListing[]>([])
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
          is_active,
          sold_at,
          view_count,
          product_images(storage_path, sort_order)
        `
        )
        .eq('seller_id', userId)
        .order('created_at', { ascending: false })

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

      const myListings: MyListing[] = (products || []).map((product) => {
        // Find the first image (lowest sort_order)
        const images = (product.product_images || []) as { storage_path: string; sort_order: number }[]
        const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order)
        const firstImage = sortedImages[0]

        const imageUrl = firstImage
          ? supabase.storage.from('products').getPublicUrl(firstImage.storage_path).data.publicUrl
          : '/placeholder-product.jpg'

        // Determine status
        let status: ListingStatus = 'active'
        if (product.sold_at) {
          status = 'sold'
        } else if (!product.is_active) {
          status = 'paused'
        }

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
          status,
          viewCount: product.view_count || 0,
          isActive: product.is_active,
          soldAt: product.sold_at,
        }
      })

      setListings(myListings)
    } catch (err) {
      setError(err as Error)
      setListings([])
    } finally {
      setLoading(false)
    }
  }, [userId])

  const togglePause = useCallback(async (listingId: string): Promise<{ error: Error | null }> => {
    try {
      const listing = listings.find(l => l.id === listingId)
      if (!listing) {
        throw new Error('Listing nicht gefunden')
      }

      const newIsActive = !listing.isActive

      const { error: updateError } = await supabase
        .from('products')
        .update({ is_active: newIsActive })
        .eq('id', listingId)
        .eq('seller_id', userId)

      if (updateError) {
        throw updateError
      }

      // Update local state
      setListings(prev => prev.map(l =>
        l.id === listingId
          ? { ...l, isActive: newIsActive, status: newIsActive ? 'active' : 'paused' }
          : l
      ))

      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }, [listings, userId])

  const markAsSold = useCallback(async (listingId: string): Promise<{ error: Error | null }> => {
    try {
      const { error: updateError } = await supabase
        .from('products')
        .update({
          sold_at: new Date().toISOString(),
          is_active: false
        })
        .eq('id', listingId)
        .eq('seller_id', userId)

      if (updateError) {
        throw updateError
      }

      // Update local state
      setListings(prev => prev.map(l =>
        l.id === listingId
          ? { ...l, status: 'sold', isActive: false, soldAt: new Date().toISOString() }
          : l
      ))

      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }, [userId])

  const deleteListing = useCallback(async (listingId: string): Promise<{ error: Error | null }> => {
    try {
      // First delete associated images from storage
      const { data: images } = await supabase
        .from('product_images')
        .select('storage_path')
        .eq('product_id', listingId)

      if (images && images.length > 0) {
        const paths = images.map(img => img.storage_path)
        await supabase.storage.from('products').remove(paths)
      }

      // Delete product images records
      await supabase
        .from('product_images')
        .delete()
        .eq('product_id', listingId)

      // Delete the product
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', listingId)
        .eq('seller_id', userId)

      if (deleteError) {
        throw deleteError
      }

      // Update local state
      setListings(prev => prev.filter(l => l.id !== listingId))

      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }, [userId])

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  return {
    listings,
    loading,
    error,
    refetch: fetchListings,
    togglePause,
    markAsSold,
    deleteListing
  }
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

// =============================================================================
// useListing - Create and update listings
// =============================================================================

export interface ListingFormData {
  title: string
  description: string
  categoryId: string
  price: number
  negotiable: boolean
  images: ListingImage[]
  zip: string
  city: string
  country: string
  condition: 'neu' | 'wie-neu' | 'sehr-gut' | 'gut' | 'akzeptabel'
  deliveryOptions: ('abholung' | 'versand')[]
  shippingCost: number | null
  phoneContactAvailable: boolean
}

export interface ListingImage {
  id: string
  file?: File
  preview: string
  storagePath?: string
  isExisting?: boolean
}

interface UseListingResult {
  listing: ListingFormData | null
  loading: boolean
  error: Error | null
  createListing: (data: ListingFormData, userId: string) => Promise<{ id: string | null; error: Error | null }>
  updateListing: (listingId: string, data: ListingFormData, userId: string) => Promise<{ error: Error | null }>
  fetchListing: (listingId: string) => Promise<void>
}

export function useListing(listingId?: string): UseListingResult {
  const [listing, setListing] = useState<ListingFormData | null>(null)
  const [loading, setLoading] = useState(!!listingId)
  const [error, setError] = useState<Error | null>(null)

  const fetchListing = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select(`
          *,
          product_images(id, storage_path, sort_order)
        `)
        .eq('id', id)
        .single()

      if (fetchError) {
        throw fetchError
      }

      const images = (product.product_images || []) as { id: string; storage_path: string; sort_order: number }[]
      const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order)

      const listingImages: ListingImage[] = sortedImages.map(img => ({
        id: img.id,
        preview: supabase.storage.from('products').getPublicUrl(img.storage_path).data.publicUrl,
        storagePath: img.storage_path,
        isExisting: true,
      }))

      setListing({
        title: product.title,
        description: product.description,
        categoryId: product.category_id,
        price: product.price,
        negotiable: product.is_negotiable ?? false,
        images: listingImages,
        zip: product.zip,
        city: product.city,
        country: 'AT', // Default, could be fetched from profile
        condition: product.condition,
        deliveryOptions: product.delivery_options,
        shippingCost: product.shipping_cost,
        phoneContactAvailable: product.phone_contact_available,
      })
    } catch (err) {
      setError(err as Error)
      setListing(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (listingId) {
      fetchListing(listingId)
    }
  }, [listingId, fetchListing])

  const uploadImages = async (images: ListingImage[], productId: string): Promise<{ paths: string[]; error: Error | null }> => {
    const paths: string[] = []

    for (let i = 0; i < images.length; i++) {
      const img = images[i]

      if (img.isExisting && img.storagePath) {
        paths.push(img.storagePath)
        continue
      }

      if (!img.file) continue

      const fileExt = img.file.name.split('.').pop()
      const fileName = `${productId}/${Date.now()}-${i}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, img.file)

      if (uploadError) {
        return { paths: [], error: uploadError }
      }

      paths.push(fileName)
    }

    return { paths, error: null }
  }

  const createListing = async (
    data: ListingFormData,
    userId: string
  ): Promise<{ id: string | null; error: Error | null }> => {
    try {
      // Create product first
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          seller_id: userId,
          category_id: data.categoryId,
          title: data.title,
          description: data.description,
          price: data.price,
          is_negotiable: data.negotiable,
          condition: data.condition,
          delivery_options: data.deliveryOptions,
          shipping_cost: data.shippingCost,
          zip: data.zip,
          city: data.city,
          phone_contact_available: data.phoneContactAvailable,
          is_active: true,
        })
        .select('id')
        .single()

      if (productError) {
        return { id: null, error: productError }
      }

      const productId = product.id

      // Upload images
      const { paths, error: uploadError } = await uploadImages(data.images, productId)
      if (uploadError) {
        // Rollback: delete product if image upload fails
        await supabase.from('products').delete().eq('id', productId)
        return { id: null, error: uploadError }
      }

      // Create image records
      if (paths.length > 0) {
        const imageRecords = paths.map((path, index) => ({
          product_id: productId,
          storage_path: path,
          sort_order: index,
        }))

        const { error: imageError } = await supabase
          .from('product_images')
          .insert(imageRecords)

        if (imageError) {
          console.error('Error creating image records:', imageError)
        }
      }

      return { id: productId, error: null }
    } catch (err) {
      return { id: null, error: err as Error }
    }
  }

  const updateListing = async (
    listingId: string,
    data: ListingFormData,
    userId: string
  ): Promise<{ error: Error | null }> => {
    try {
      // Update product
      const { error: productError } = await supabase
        .from('products')
        .update({
          category_id: data.categoryId,
          title: data.title,
          description: data.description,
          price: data.price,
          is_negotiable: data.negotiable,
          condition: data.condition,
          delivery_options: data.deliveryOptions,
          shipping_cost: data.shippingCost,
          zip: data.zip,
          city: data.city,
          phone_contact_available: data.phoneContactAvailable,
        })
        .eq('id', listingId)
        .eq('seller_id', userId)

      if (productError) {
        return { error: productError }
      }

      // Get existing images
      const { data: existingImages } = await supabase
        .from('product_images')
        .select('id, storage_path')
        .eq('product_id', listingId)

      const existingPaths = new Set((existingImages || []).map(img => img.storage_path))
      const keepPaths = new Set(data.images.filter(img => img.isExisting && img.storagePath).map(img => img.storagePath))

      // Delete removed images from storage
      const pathsToDelete = [...existingPaths].filter(path => !keepPaths.has(path))
      if (pathsToDelete.length > 0) {
        await supabase.storage.from('products').remove(pathsToDelete)
      }

      // Delete all existing image records
      await supabase
        .from('product_images')
        .delete()
        .eq('product_id', listingId)

      // Upload new images and get all paths
      const { paths, error: uploadError } = await uploadImages(data.images, listingId)
      if (uploadError) {
        return { error: uploadError }
      }

      // Create new image records
      if (paths.length > 0) {
        const imageRecords = paths.map((path, index) => ({
          product_id: listingId,
          storage_path: path,
          sort_order: index,
        }))

        const { error: imageError } = await supabase
          .from('product_images')
          .insert(imageRecords)

        if (imageError) {
          console.error('Error creating image records:', imageError)
        }
      }

      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }

  return {
    listing,
    loading,
    error,
    createListing,
    updateListing,
    fetchListing,
  }
}

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { geocodeAddress, calculateDistance } from '@/marketplace/utils/geocoding'
import type { Tables } from '@/types/database'
import type {
  Product,
  Category,
  SortOption,
  ProductFilters,
} from '@/../product/sections/produktkatalog-suche/types'

// =============================================================================
// useCategories - Fetch all categories
// =============================================================================

interface UseCategoriesResult {
  categories: Category[]
  loading: boolean
  error: Error | null
}

export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch ALL categories (parents + children) in one query
        const { data, error: fetchError } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order', { ascending: true })

        if (fetchError) {
          throw fetchError
        }

        const allCategories = (data || []) as Tables<'categories'>[]

        // Build hierarchical structure: parent categories with subcategories
        const parentCategories = allCategories.filter(cat => !cat.parent_id)
        const childCategories = allCategories.filter(cat => cat.parent_id)

        const mappedCategories: Category[] = parentCategories.map(parent => ({
          id: parent.id,
          name: parent.name,
          slug: parent.slug,
          subcategories: childCategories
            .filter(child => child.parent_id === parent.id)
            .map(child => ({
              id: child.id,
              name: child.name,
              slug: child.slug,
            })),
        }))

        setCategories(mappedCategories)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}

// =============================================================================
// useProducts - Fetch products with filters
// =============================================================================

interface UseProductsResult {
  products: Product[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

// Type for the joined query result
interface ProductQueryResult {
  id: string
  seller_id: string
  category_id: string
  title: string
  description: string
  price: number
  is_negotiable: boolean
  condition: string
  delivery_options: string[]
  shipping_cost: number | null
  street: string | null
  zip: string
  city: string
  latitude: number | null
  longitude: number | null
  geocoded_at: string | null
  phone_contact_available: boolean
  view_count: number
  is_active: boolean
  sold_at: string | null
  created_at: string
  updated_at: string
  profiles: {
    id: string
    name: string
    is_verified: boolean
  } | null
  categories: {
    id: string
    name: string
    slug: string
    parent_id: string | null
  }
  product_images: {
    id: string
    storage_path: string
    sort_order: number
  }[]
}

export function useProducts(
  filters: ProductFilters,
  sortBy: SortOption,
  userId: string | undefined,
  favoriteIds: Set<string>
): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Use ref to avoid favoriteIds Set reference changes triggering re-fetches
  const favoriteIdsRef = useRef(favoriteIds)
  favoriteIdsRef.current = favoriteIds

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    // Timeout protection (10 seconds)
    const timeoutId = setTimeout(() => {
      setLoading(false)
      setError(new Error('Request timeout - please refresh the page'))
    }, 10000)

    try {
      let categoryIds: string[] = []
      let searchLocation: { latitude: number; longitude: number } | null = null

      // If category filter is applied, find the category IDs
      if (filters.subcategory) {
        // Specific subcategory selected - filter by that subcategory ID
        const { data: subData } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', filters.subcategory)
          .single()

        if (subData) {
          categoryIds = [subData.id]
        }
      } else if (filters.category) {
        // Only main category selected - filter by all its subcategories
        const { data: parentData } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', filters.category)
          .single()

        if (parentData) {
          const { data: childData } = await supabase
            .from('categories')
            .select('id')
            .eq('parent_id', parentData.id)

          categoryIds = (childData || []).map(c => c.id)
          // Also include the parent itself in case products are directly assigned to it
          categoryIds.push(parentData.id)
        }
      }

      // Build query
      let query = supabase
        .from('products')
        .select(
          `
          *,
          profiles!seller_id(id, name, is_verified),
          categories!category_id(id, name, slug, parent_id),
          product_images(id, storage_path, sort_order)
        `
        )
        .eq('is_active', true)
        .is('sold_at', null)
        .is('pending_since', null)

      // Apply filters
      if (filters.searchQuery) {
        query = query.or(
          `title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`
        )
      }

      if (categoryIds.length > 0) {
        // Filter by category_id(s)
        query = query.in('category_id', categoryIds)
      }

      if (filters.priceMin !== undefined) {
        query = query.gte('price', filters.priceMin)
      }

      if (filters.priceMax !== undefined) {
        query = query.lte('price', filters.priceMax)
      }

      if (filters.condition && filters.condition !== 'alle') {
        query = query.eq('condition', filters.condition)
      }

      if (filters.deliveryOption && filters.deliveryOption !== 'alle') {
        query = query.contains('delivery_options', [filters.deliveryOption])
      }

      // Handle ZIP code filtering (exact match or radius search)
      if (filters.zipCode) {
        if (filters.radius) {
          // PROXIMITY SEARCH: Geocode user's ZIP and filter by distance
          // Step 1: Geocode the search ZIP code (city is optional, only zip and country needed)
          const { result, error: geocodingError } = await geocodeAddress({
            zip: filters.zipCode,
            country: 'AT' // TODO: Use user's country from profile
          })

          if (geocodingError) {
            console.error('Failed to geocode search location:', geocodingError.message)
            // Fallback to exact ZIP match if geocoding fails
            query = query.eq('zip', filters.zipCode)
          } else if (result) {
            // Step 2: Fetch ALL products with coordinates for distance calculation
            // (We will filter by distance client-side below)
            searchLocation = result
            query = query.not('latitude', 'is', null).not('longitude', 'is', null)
          }
        } else {
          // Exact ZIP match (no radius)
          query = query.eq('zip', filters.zipCode)
        }
      }

      // Apply sorting
      switch (sortBy) {
        case 'price-asc':
          query = query.order('price', { ascending: true })
          break
        case 'price-desc':
          query = query.order('price', { ascending: false })
          break
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false })
          break
      }

      const { data, error: fetchError } = await query

      if (fetchError) {
        throw fetchError
      }

      // Cast and map to Product type
      const queryResults = (data || []) as unknown as ProductQueryResult[]
      const mappedProducts: Product[] = queryResults.map((product) => {
        const profile = product.profiles
        const category = product.categories
        const images = product.product_images || []

        // Sort images by sort_order and get URLs
        const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order)
        const imageUrls = sortedImages.map(
          (img) => supabase.storage.from('products').getPublicUrl(img.storage_path).data.publicUrl
        )

        // Calculate distance if radius search is active
        let distance: number | undefined
        if (searchLocation && product.latitude && product.longitude) {
          distance = calculateDistance(
            searchLocation.latitude,
            searchLocation.longitude,
            product.latitude,
            product.longitude
          )
        }

        return {
          id: product.id,
          title: product.title,
          description: product.description,
          price: Number(product.price),
          isNegotiable: product.is_negotiable ?? false,
          images: imageUrls.length > 0 ? imageUrls : [],
          condition: product.condition as Product['condition'],
          deliveryOptions: product.delivery_options as Product['deliveryOptions'],
          location: {
            zip: product.zip,
            city: product.city,
            street: product.street || undefined,
            latitude: product.latitude || undefined,
            longitude: product.longitude || undefined,
          },
          seller: {
            id: profile?.id ?? product.seller_id,
            name: profile?.name ?? 'Unbekannter Verkäufer',
            rating: 5, // Placeholder - ratings not implemented yet
          },
          category: category?.name ?? 'Uncategorized',
          subcategory: category?.parent_id ? category.name : '',
          createdAt: product.created_at,
          phoneContactAvailable: product.phone_contact_available,
          isFavorited: favoriteIdsRef.current.has(product.id),
          isOwn: userId === product.seller_id,
          distance,
        }
      })

      // Filter by distance if radius search is active
      let filteredProducts = mappedProducts
      if (searchLocation && filters.radius) {
        filteredProducts = mappedProducts.filter((product) => {
          // Only include products with calculated distance within the radius
          return product.distance !== undefined && product.distance <= filters.radius!
        })
      }

      setProducts(filteredProducts)
    } catch (err) {
      setError(err as Error)
      setProducts([])
    } finally {
      clearTimeout(timeoutId)
      setLoading(false)
    }
  }, [filters, sortBy, userId])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Auto-refetch on window focus and visibility change
  useEffect(() => {
    // Refetch when window regains focus
    const handleFocus = () => {
      console.log('[Products] Window focused, refetching...')
      fetchProducts()
    }

    // Handle visibility change (tab became visible)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('[Products] Page became visible, refetching...')
        fetchProducts()
      }
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [fetchProducts])

  // Update isFavorited status when favoriteIds changes
  useEffect(() => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => ({
        ...product,
        isFavorited: favoriteIdsRef.current.has(product.id),
      }))
    )
  }, [favoriteIds])

  return { products, loading, error, refetch: fetchProducts }
}

// =============================================================================
// useDeleteProduct - Delete a product
// =============================================================================

interface UseDeleteProductResult {
  deleteProduct: (productId: string) => Promise<{ error: Error | null }>
  deleting: boolean
}

export function useDeleteProduct(): UseDeleteProductResult {
  const [deleting, setDeleting] = useState(false)

  const deleteProduct = async (productId: string): Promise<{ error: Error | null }> => {
    setDeleting(true)
    try {
      // First delete product images from storage
      const { data: images } = await supabase
        .from('product_images')
        .select('storage_path')
        .eq('product_id', productId)

      if (images && images.length > 0) {
        const paths = (images as { storage_path: string }[]).map((img) => img.storage_path)
        await supabase.storage.from('products').remove(paths)
      }

      // Delete the product (cascade will remove product_images rows)
      const { error } = await supabase.from('products').delete().eq('id', productId)

      if (error) {
        return { error }
      }

      return { error: null }
    } catch (err) {
      return { error: err as Error }
    } finally {
      setDeleting(false)
    }
  }

  return { deleteProduct, deleting }
}

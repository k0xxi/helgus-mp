import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
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
        const { data, error: fetchError } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order', { ascending: true })

        if (fetchError) {
          throw fetchError
        }

        // Map to Category type (no subcategories for now - DB only has top-level)
        const mappedCategories: Category[] = ((data || []) as Tables<'categories'>[]).map(
          (cat) => ({
            id: cat.id,
            name: cat.name,
            subcategories: [], // Subcategories not implemented yet
          })
        )

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
  condition: string
  delivery_options: string[]
  shipping_cost: number | null
  zip: string
  city: string
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
  }
  categories: {
    id: string
    name: string
    slug: string
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

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Start building query
      let query = supabase
        .from('products')
        .select(
          `
          *,
          profiles!inner(id, name, is_verified),
          categories!inner(id, name, slug),
          product_images(id, storage_path, sort_order)
        `
        )
        .eq('is_active', true)

      // Apply filters
      if (filters.searchQuery) {
        query = query.or(
          `title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`
        )
      }

      if (filters.category) {
        // Filter by category name
        query = query.eq('categories.name', filters.category)
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

      if (filters.zipCode) {
        // For MVP: exact ZIP match (radius search requires geolocation)
        query = query.eq('zip', filters.zipCode)
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

        return {
          id: product.id,
          title: product.title,
          description: product.description,
          price: Number(product.price),
          images: imageUrls.length > 0 ? imageUrls : [],
          condition: product.condition as Product['condition'],
          deliveryOptions: product.delivery_options as Product['deliveryOptions'],
          location: {
            zip: product.zip,
            city: product.city,
          },
          seller: {
            id: profile.id,
            name: profile.name,
            rating: 5, // Placeholder - ratings not implemented yet
          },
          category: category.name,
          subcategory: '', // Subcategories not implemented yet
          createdAt: product.created_at,
          phoneContactAvailable: product.phone_contact_available,
          isFavorited: favoriteIds.has(product.id),
          isOwn: userId === product.seller_id,
        }
      })

      setProducts(mappedProducts)
    } catch (err) {
      setError(err as Error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [filters, sortBy, userId, favoriteIds])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

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

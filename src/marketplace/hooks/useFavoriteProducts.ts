import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/../product/sections/produktkatalog-suche/types'

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
  zip: string
  city: string
  phone_contact_available: boolean
  created_at: string
  is_active: boolean
  profiles: {
    id: string
    name: string
    is_verified: boolean
  } | null
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

interface UseFavoriteProductsResult {
  products: Product[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useFavoriteProducts(userId: string | undefined): UseFavoriteProductsResult {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchFavoriteProducts = useCallback(async () => {
    if (!userId) {
      setProducts([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Fetch favorited product IDs
      const { data: favorites, error: favError } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', userId)

      if (favError) throw favError

      if (!favorites || favorites.length === 0) {
        setProducts([])
        setLoading(false)
        return
      }

      const favoritesData = (favorites || []) as { product_id: string }[]
      const productIds = favoritesData.map((fav) => fav.product_id)

      // Fetch products with all details for favorited items
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(
          `
          *,
          profiles!seller_id(id, name, is_verified),
          categories!category_id(id, name, slug),
          product_images(id, storage_path, sort_order)
        `
        )
        .in('id', productIds)
        .eq('is_active', true)
        .is('sold_at', null)
        .is('pending_since', null)

      if (productsError) throw productsError

      // Cast and map to Product type
      const queryResults = (productsData || []) as unknown as ProductQueryResult[]
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
          isNegotiable: product.is_negotiable ?? false,
          images: imageUrls.length > 0 ? imageUrls : [],
          condition: product.condition as Product['condition'],
          deliveryOptions: product.delivery_options as Product['deliveryOptions'],
          location: {
            zip: product.zip,
            city: product.city,
          },
          seller: {
            id: profile?.id ?? product.seller_id,
            name: profile?.name ?? 'Unbekannter Verkäufer',
            rating: 5, // Placeholder - ratings not implemented yet
          },
          category: category?.name ?? 'Uncategorized',
          subcategory: '', // Subcategories not implemented yet
          createdAt: product.created_at,
          phoneContactAvailable: product.phone_contact_available,
          isFavorited: true, // These are all favorited products
          isOwn: false, // User viewing their own favorites won't be their own products
        }
      })

      setProducts(mappedProducts)
    } catch (err) {
      setError(err as Error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchFavoriteProducts()
  }, [fetchFavoriteProducts])

  return {
    products,
    loading,
    error,
    refetch: fetchFavoriteProducts,
  }
}

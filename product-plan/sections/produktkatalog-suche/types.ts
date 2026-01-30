// =============================================================================
// Data Types
// =============================================================================

export interface Location {
  zip: string
  city: string
}

export interface Seller {
  id: string
  name: string
  rating: number
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  condition: 'neu' | 'wie-neu' | 'sehr-gut' | 'gut' | 'akzeptabel'
  deliveryOptions: ('abholung' | 'versand')[]
  location: Location
  seller: Seller
  category: string
  subcategory: string
  createdAt: string
  phoneContactAvailable: boolean
  isFavorited: boolean
  isOwn: boolean
}

export interface Category {
  id: string
  name: string
  subcategories: string[]
}

// =============================================================================
// Filter Types
// =============================================================================

export interface ProductFilters {
  searchQuery?: string
  category?: string
  subcategory?: string
  priceMin?: number
  priceMax?: number
  zipCode?: string
  radius?: 10 | 25 | 50 | 100 | 200
  deliveryOption?: 'alle' | 'abholung' | 'versand'
  condition?: 'alle' | 'neu' | 'wie-neu' | 'sehr-gut' | 'gut' | 'akzeptabel'
}

export type SortOption = 'newest' | 'price-asc' | 'price-desc'

// =============================================================================
// Component Props
// =============================================================================

export interface ProductCatalogProps {
  /** The list of products to display */
  products: Product[]
  /** Available categories for filtering */
  categories: Category[]
  /** Currently active filters */
  filters?: ProductFilters
  /** Current sort option */
  sortBy?: SortOption
  /** Called when user applies filters */
  onApplyFilters?: (filters: ProductFilters) => void
  /** Called when user resets all filters */
  onResetFilters?: () => void
  /** Called when user changes sort option */
  onSortChange?: (sortBy: SortOption) => void
  /** Called when user clicks on a product card to view details */
  onViewProduct?: (productId: string) => void
  /** Called when user toggles favorite status on a product */
  onToggleFavorite?: (productId: string) => void
  /** Called when user wants to edit their own product */
  onEditProduct?: (productId: string) => void
  /** Called when user wants to delete their own product */
  onDeleteProduct?: (productId: string) => void
}

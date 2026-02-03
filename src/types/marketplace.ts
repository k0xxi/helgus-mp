/**
 * HELGUS Marktplatz - Application-level Types
 *
 * These types are used throughout the application for props, state, and UI.
 * They may include joined data and computed fields not present in the raw database.
 */

// Re-export database enums for convenience
export type { ProductCondition, DeliveryOption, OfferStatus, NotificationType } from './database'

// =============================================================================
// User & Profile
// =============================================================================

export interface Profile {
  id: string
  name: string
  avatarUrl: string | null
  bio: string | null
  phone: string | null
  street: string | null
  houseNumber: string | null
  zip: string | null
  city: string | null
  country: string
  isVerified: boolean
  verifiedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface SellerVerification {
  id: string
  userId: string
  fullName: string
  street: string
  houseNumber: string
  zip: string
  city: string
  country: string
  iban: string
  bic: string | null
  acceptedTerms: boolean
  status: 'pending' | 'verified' | 'rejected'
  createdAt: Date
}

export interface PublicProfile {
  id: string
  name: string
  avatarUrl: string | null
  bio: string | null
  city: string | null
  country: string
  isVerified: boolean
  memberSince: Date
  listingsCount: number
  responseTime: string | null
}

// =============================================================================
// Categories
// =============================================================================

export interface Category {
  id: string
  name: string
  slug: string
  parentId: string | null
  sortOrder: number
  subcategories?: Category[]
}

// =============================================================================
// Products
// =============================================================================

export interface ProductImage {
  id: string
  productId: string
  storagePath: string
  url: string // Full public URL
  sortOrder: number
}

export interface Product {
  id: string
  sellerId: string
  categoryId: string
  title: string
  description: string
  price: number
  condition: 'neu' | 'wie-neu' | 'sehr-gut' | 'gut' | 'akzeptabel'
  deliveryOptions: ('abholung' | 'versand')[]
  shippingCost: number | null
  zip: string
  city: string
  phoneContactAvailable: boolean
  viewCount: number
  isActive: boolean
  soldAt: Date | null
  buyerId: string | null
  pendingSince: Date | null
  createdAt: Date
  updatedAt: Date
  // Joined data
  images: ProductImage[]
  seller?: PublicProfile
  category?: Category
  isFavorited?: boolean
  isOwn?: boolean
}

export interface ProductFilters {
  searchQuery?: string
  categoryId?: string
  priceMin?: number
  priceMax?: number
  zipCode?: string
  radius?: 10 | 25 | 50 | 100 | 200
  deliveryOption?: 'alle' | 'abholung' | 'versand'
  condition?: 'alle' | 'neu' | 'wie-neu' | 'sehr-gut' | 'gut' | 'akzeptabel'
}

export type ProductSortOption = 'newest' | 'price-asc' | 'price-desc'

// =============================================================================
// Favorites
// =============================================================================

export interface Favorite {
  userId: string
  productId: string
  createdAt: Date
  product?: Product
}

// =============================================================================
// Conversations & Messages
// =============================================================================

export interface Conversation {
  id: string
  productId: string
  buyerId: string
  sellerId: string
  createdAt: Date
  // Joined data
  product?: Product
  buyer?: PublicProfile
  seller?: PublicProfile
  lastMessage?: Message
  unreadCount?: number
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  isRead: boolean
  createdAt: Date
  sender?: PublicProfile
}

// =============================================================================
// Offers
// =============================================================================

export interface Offer {
  id: string
  productId: string
  buyerId: string
  amount: number
  message: string | null
  status: 'pending' | 'accepted' | 'declined'
  respondedAt: Date | null
  createdAt: Date
  // Joined data
  product?: Product
  buyer?: PublicProfile
}

// =============================================================================
// Purchases
// =============================================================================

export type PurchaseType = 'direct' | 'offer_accepted'
export type PurchaseStatus = 'pending' | 'completed' | 'cancelled'
export type ListingStatus = 'active' | 'paused' | 'pending' | 'sold'

export interface Purchase {
  id: string
  productId: string
  sellerId: string
  buyerId: string
  priceAtPurchase: number
  purchaseType: PurchaseType
  offerId: string | null
  status: PurchaseStatus
  shippingMethod?: 'Abholung' | 'Versand'
  purchasedAt: Date
  completedAt: Date | null
  cancelledAt: Date | null
  // Joined data
  product?: Product
  buyer?: PublicProfile
  seller?: PublicProfile
}

// =============================================================================
// Notifications
// =============================================================================

export interface Notification {
  id: string
  userId: string
  type: 'new_message' | 'offer_received' | 'offer_accepted' | 'offer_declined' | 'price_drop' | 'purchase_initiated' | 'purchase_cancelled' | 'purchase_completed'
  title: string
  message: string
  productId: string | null
  isRead: boolean
  createdAt: Date
  product?: Product
}

// =============================================================================
// Auth
// =============================================================================

export interface AuthUser {
  id: string
  email: string
  profile: Profile | null
}

export interface SignUpData {
  email: string
  password: string
  name: string
}

export interface SignInData {
  email: string
  password: string
}

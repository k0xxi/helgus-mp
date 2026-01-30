// =============================================================================
// Data Types
// =============================================================================

export interface Location {
  zip: string
  city: string
  country?: string // ISO 3166-1 alpha-2 (DE, AT, CH, etc.)
  latitude?: number
  longitude?: number
}

export interface Seller {
  id: string
  name: string
  email: string
  avatar: string
  memberSince: string
  isVerified: boolean
}

export interface DashboardStats {
  activeListings: number
  totalViews: number
  unreadMessages: number
  pendingOffers: number
  soldThisMonth: number
}

export type QuickActionType = 'create-listing' | 'open-inbox' | 'view-listings' | 'open-settings'

export interface QuickAction {
  id: string
  label: string
  icon: 'plus' | 'message' | 'grid' | 'settings'
  action: QuickActionType
  badge?: number
}

export type ProductStatus = 'aktiv' | 'verkauft' | 'pausiert' | 'abgelaufen'
export type ProductCondition = 'neu' | 'wie-neu' | 'sehr-gut' | 'gut' | 'akzeptabel'

export interface SellerProduct {
  id: string
  title: string
  description: string
  price: number
  negotiable: boolean
  images: string[]
  category: string
  subcategory: string
  condition: ProductCondition
  location: Location
  shippingAvailable: boolean
  status: ProductStatus
  views: number
  inquiries: number
  favorites: number
  createdAt: string
  updatedAt: string
  soldAt?: string
}

export interface Buyer {
  id: string
  name: string
  avatar: string
}

export interface Conversation {
  id: string
  productId: string
  productTitle: string
  productImage: string
  buyer: Buyer
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  hasOffer: boolean
  offerAmount?: number
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  isOwn: boolean
  isRead: boolean
}

export interface Subcategory {
  id: string
  name: string
  slug: string
}

export interface Category {
  id: string
  name: string
  slug: string
  subcategories: Subcategory[]
}

// =============================================================================
// Form Types (for Multi-Step Listing Form)
// =============================================================================

export interface ListingFormData {
  // Step 1: Basis-Infos
  title: string
  description: string
  category: string
  subcategory: string
  price: number
  negotiable: boolean
  // Step 2: Bilder
  images: string[]
  // Step 3: Standort
  location: Location
  // Step 4: Zusätzliche Optionen
  condition: ProductCondition
  shippingAvailable: boolean
}

// =============================================================================
// Component Props
// =============================================================================

export interface SellerDashboardProps {
  /** Der eingeloggte Verkäufer */
  seller: Seller
  /** Dashboard-Statistiken */
  stats: DashboardStats
  /** Quick-Action-Buttons */
  quickActions: QuickAction[]

  /** Called when user clicks a quick action */
  onQuickAction?: (action: QuickActionType) => void
}

export interface ListingsGridProps {
  /** Die Anzeigen des Verkäufers */
  products: SellerProduct[]

  /** Called when user wants to view a listing */
  onView?: (productId: string) => void
  /** Called when user wants to edit a listing */
  onEdit?: (productId: string) => void
  /** Called when user wants to delete a listing */
  onDelete?: (productId: string) => void
  /** Called when user wants to pause/unpause a listing */
  onTogglePause?: (productId: string) => void
  /** Called when user marks a listing as sold */
  onMarkAsSold?: (productId: string) => void
  /** Called when user wants to create a new listing */
  onCreate?: () => void
}

export interface ListingFormProps {
  /** Available categories for selection */
  categories: Category[]
  /** Initial data for editing (undefined for new listings) */
  initialData?: Partial<ListingFormData>
  /** Current step (1-4) */
  currentStep?: number

  /** Called when form is submitted */
  onSubmit?: (data: ListingFormData) => void
  /** Called when user cancels the form */
  onCancel?: () => void
  /** Called when user navigates to next step */
  onNextStep?: (step: number, partialData: Partial<ListingFormData>) => void
  /** Called when user navigates to previous step */
  onPrevStep?: (step: number) => void
}

export interface InboxProps {
  /** Liste der Konversationen */
  conversations: Conversation[]
  /** Nachrichten der ausgewählten Konversation */
  messages: Message[]
  /** ID der aktuell ausgewählten Konversation */
  selectedConversationId?: string

  /** Called when user selects a conversation */
  onSelectConversation?: (conversationId: string) => void
  /** Called when user sends a message */
  onSendMessage?: (conversationId: string, content: string) => void
  /** Called when user accepts an offer */
  onAcceptOffer?: (conversationId: string) => void
  /** Called when user declines an offer */
  onDeclineOffer?: (conversationId: string) => void
  /** Called when user wants to view the product */
  onViewProduct?: (productId: string) => void
}

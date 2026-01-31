// =============================================================================
// Data Types
// =============================================================================

export interface ProductImage {
  id: string
  url: string
  alt: string
}

export interface ShippingOptions {
  pickup: boolean
  shipping: boolean
  shippingCost?: number
}

export interface Product {
  id: string
  title: string
  price: number
  description: string
  condition: 'Neu' | 'Wie neu' | 'Gut' | 'Akzeptabel'
  images: ProductImage[]
  postalCode: string
  city: string
  createdAt: string
  shippingOptions: ShippingOptions
  isFavorite: boolean
  viewCount: number
  sellerId: string
}

export interface Seller {
  id: string
  name: string
  avatar?: string
  city: string
  memberSince: string
  rating: number
  totalSales: number
  responseTime: string
  isVerified: boolean
}

export interface CategoryItem {
  id: string
  name: string
  slug: string
}

export interface Category {
  main: CategoryItem
  sub: CategoryItem
}

export interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  isOwn: boolean
  isRead: boolean
}

export type OfferStatus = 'pending' | 'accepted' | 'declined'

export interface Offer {
  id: string
  productId: string
  buyerId: string
  buyerName: string
  amount: number
  originalPrice: number
  message?: string
  status: OfferStatus
  createdAt: string
  respondedAt?: string
}

export type NotificationType =
  | 'new_message'
  | 'offer_received'
  | 'offer_accepted'
  | 'offer_declined'
  | 'price_drop'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  productId: string
  productTitle: string
  timestamp: string
  isRead: boolean
}

export interface CurrentUser {
  id: string
  name: string
  unreadNotifications: number
}

// =============================================================================
// Component Props
// =============================================================================

export interface ProductDetailProps {
  /** Das angezeigte Produkt */
  product: Product
  /** Der Verkäufer des Produkts */
  seller: Seller
  /** Der Käufer (für Verkäufersicht) */
  buyer?: Seller | null
  /** Kategorie-Pfad für Breadcrumb */
  category: Category
  /** Chat-Nachrichten zu diesem Produkt */
  messages: Message[]
  /** Gegenangebote für dieses Produkt */
  offers: Offer[]
  /** Benachrichtigungen des aktuellen Users */
  notifications: Notification[]
  /** Aktueller Benutzer */
  currentUser: CurrentUser
  /** Typing indicator state */
  isTyping?: boolean

  // === Navigation ===
  /** Zurück zur vorherigen Seite */
  onBack?: () => void
  /** Zur Kategorie navigieren */
  onCategoryClick?: (slug: string) => void

  // === Produkt-Aktionen ===
  /** Gegenangebot senden */
  onMakeOffer?: (amount: number, message?: string) => void
  /** Kaufanfrage senden */
  onBuyRequest?: () => void
  /** Als Favorit speichern/entfernen */
  onToggleFavorite?: (productId: string) => void
  /** Produkt teilen */
  onShare?: (productId: string) => void

  // === Kommunikation ===
  /** Nachricht an Verkäufer senden */
  onSendMessage?: (content: string) => void
  /** Verkäufer-Profil anzeigen */
  onViewSellerProfile?: (sellerId: string) => void

  // === Benachrichtigungen ===
  /** Benachrichtigung als gelesen markieren */
  onMarkNotificationRead?: (notificationId: string) => void
  /** Alle Benachrichtigungen als gelesen markieren */
  onMarkAllNotificationsRead?: () => void
  /** Auf Benachrichtigung klicken */
  onNotificationClick?: (notification: Notification) => void

  // === Gegenangebote (für Verkäufer-Ansicht) ===
  /** Gegenangebot akzeptieren */
  onAcceptOffer?: (offerId: string) => void
  /** Gegenangebot ablehnen */
  onDeclineOffer?: (offerId: string) => void
}

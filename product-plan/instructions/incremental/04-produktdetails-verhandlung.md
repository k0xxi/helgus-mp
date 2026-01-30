# Milestone 04: Produktdetails & Verhandlung

Build the product detail page with image gallery, counter-offer system, and messaging.

## Overview

The product detail page shows complete product information, allows users to make counter-offers, and enables direct communication with sellers via chat.

## Components to Build

### 1. ProductDetail

Main container for the product detail page.

**File**: `components/sections/produktdetails-verhandlung/ProductDetail.tsx`

**Layout**:
- Sticky header bar with back button and notifications
- Breadcrumb navigation
- Two-column layout: Image gallery (left) + Details (right)
- Mobile: Stacked single column

**Sections**:
- Image gallery
- Title & Price
- "Gegenangebot machen" button (blue)
- Badges (condition, location, date)
- Shipping options card
- Description
- Seller card
- Action buttons (Kaufen, Favorite, Share)
- View count

### 2. ImageGallery

Product image carousel with thumbnails.

**File**: `components/sections/produktdetails-verhandlung/ImageGallery.tsx`

**Features**:
- Main large image display
- Thumbnail row below main image
- Click thumbnail to change main image
- Smooth transitions between images
- Fallback for missing images

### 3. SellerCard

Seller information card with contact option.

**File**: `components/sections/produktdetails-verhandlung/SellerCard.tsx`

**Elements**:
- Seller avatar
- Seller name with verified badge (if applicable)
- Location (city)
- Member since date
- Rating display
- Total sales count
- Response time
- "Nachricht senden" button

### 4. ChatDrawer

Slide-out drawer for messaging.

**File**: `components/sections/produktdetails-verhandlung/ChatDrawer.tsx`

**Features**:
- Slide from right (overlay on mobile, side panel on desktop)
- Header with seller info and close button
- Message history with bubbles
- Own messages aligned right (blue background)
- Other messages aligned left (gray background)
- Input field with send button
- Scroll to bottom on new message

### 5. OfferModal

Modal for making counter-offers.

**File**: `components/sections/produktdetails-verhandlung/OfferModal.tsx`

**Fields**:
- Product title (display only)
- Original price (display only)
- Offer amount input (number)
- Optional message textarea
- "Angebot senden" button
- "Abbrechen" button

**Validation**:
- Offer must be > 0
- Offer should be less than original price (show warning if higher)

### 6. NotificationDropdown

Notifications panel in header.

**File**: `components/sections/produktdetails-verhandlung/NotificationDropdown.tsx`

**Features**:
- Bell icon with unread count badge
- Dropdown panel with notification list
- Notification types: new_message, offer_received, offer_accepted, offer_declined, price_drop
- Mark individual as read
- "Alle als gelesen markieren" option
- Click notification → navigate to relevant page

## User Flows

1. **View Product**: See full details, images, seller info
2. **Browse Images**: Click thumbnails to view different images
3. **Make Offer**: Open modal → enter amount → send offer
4. **Send Message**: Open chat drawer → type message → send
5. **Buy Product**: Click "Kaufen" → trigger purchase flow
6. **Favorite**: Toggle favorite status
7. **Share**: Open share options
8. **Check Notifications**: View and interact with notifications

## UI Specifications

### Header Bar
- Sticky top with backdrop blur
- Back button with "Zurück" text
- Notifications icon on right

### Breadcrumb
- Text: `text-slate-500 dark:text-slate-400`
- Separator: `/`
- Current item: `text-slate-600 dark:text-slate-300 font-medium`

### Price Display
- Size: `text-3xl sm:text-4xl`
- Color: `text-red-600 dark:text-red-500`
- Weight: `font-bold`

### Offer Button
- Color: `bg-blue-600 hover:bg-blue-700`
- Icon: Currency/money icon

### Action Buttons
- Buy: `bg-red-600 hover:bg-red-700` with shadow
- Favorite: Border style, red when active
- Share: Border style

### Chat Bubbles
- Own: `bg-blue-600 text-white` (right-aligned)
- Other: `bg-slate-100 dark:bg-slate-700` (left-aligned)

### Modal
- Centered overlay with backdrop
- White/dark card
- Rounded corners (2xl)
- Close button in header

## Data Types

```typescript
interface Product {
  id: string
  title: string
  price: number
  description: string
  condition: 'Neu' | 'Wie neu' | 'Gut' | 'Akzeptabel'
  images: ProductImage[]
  postalCode: string
  city: string
  createdAt: string
  shippingOptions: { pickup: boolean; shipping: boolean; shippingCost?: number }
  isFavorite: boolean
  viewCount: number
  sellerId: string
}

interface Seller {
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

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  isOwn: boolean
  isRead: boolean
}

interface Notification {
  id: string
  type: 'new_message' | 'offer_received' | 'offer_accepted' | 'offer_declined' | 'price_drop'
  title: string
  message: string
  productId: string
  productTitle: string
  timestamp: string
  isRead: boolean
}
```

## Acceptance Criteria

- [ ] Image gallery displays with clickable thumbnails
- [ ] Product details show all information
- [ ] Counter-offer modal works correctly
- [ ] Chat drawer slides in/out smoothly
- [ ] Messages display with correct alignment
- [ ] Notification dropdown shows unread count
- [ ] Mark notifications as read works
- [ ] Breadcrumb navigation functional
- [ ] All action buttons trigger callbacks
- [ ] Dark mode fully supported

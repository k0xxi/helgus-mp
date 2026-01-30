# Milestone 05: Verkäufer-Dashboard

Build the seller dashboard for managing listings, viewing stats, and handling messages.

## Overview

The seller dashboard is the central hub for sellers to create and manage their listings, view statistics, and communicate with buyers.

## Components to Build

### 1. SellerDashboard

Main dashboard overview page.

**File**: `components/sections/verkaeufer-dashboard/SellerDashboard.tsx`

**Sections**:
- Header with seller avatar, name, and verified badge
- Quick action buttons grid (4 buttons)
- Stats cards row (4 cards)
- Two-column layout: Recent messages + Top products

**Quick Actions**:
- "Neue Anzeige" (primary, plus icon)
- "Nachrichten" (with unread badge)
- "Meine Anzeigen" (grid icon)
- "Einstellungen" (settings icon)

**Stats Cards**:
- Aktive Anzeigen (blue accent)
- Gesamtaufrufe (slate accent)
- Offene Nachrichten (red accent if > 0)
- Verkauft (Monat) (green accent)

### 2. ListingsGrid

Grid of seller's listings with management actions.

**File**: `components/sections/verkaeufer-dashboard/ListingsGrid.tsx`

**Features**:
- Grid of ListingCard components
- Filter by status (all, active, sold, paused)
- Empty state with CTA to create first listing
- Responsive: 3 cols desktop, 2 cols tablet, 1 col mobile

### 3. ListingCard

Individual listing card for the dashboard.

**File**: `components/sections/verkaeufer-dashboard/ListingCard.tsx`

**Elements**:
- Product image
- Title (truncated)
- Price
- Status badge (Aktiv/Verkauft/Pausiert/Abgelaufen)
- Stats: views, inquiries count
- Action menu (dropdown with edit, pause, delete, mark sold)

### 4. ListingForm

Multi-step form for creating/editing listings.

**File**: `components/sections/verkaeufer-dashboard/ListingForm.tsx`

**Steps**:
1. **Basis-Infos**: Title, Description, Category/Subcategory, Price, Negotiable
2. **Bilder**: Image upload (multiple), reorder, delete
3. **Standort**: ZIP, City, Country selector
4. **Optionen**: Condition, Shipping available

**Features**:
- Step indicator (1-4)
- Back/Next buttons
- Form validation per step
- Save draft capability
- Final "Anzeige veröffentlichen" button

### 5. Inbox (Optional)

Message inbox with conversation list.

**File**: `components/sections/verkaeufer-dashboard/Inbox.tsx`

**Layout**:
- Sidebar with conversation list
- Main area with selected conversation
- Mobile: List view, tap to open conversation

**Conversation Item**:
- Buyer avatar
- Buyer name
- Product title
- Last message preview
- Timestamp
- Unread indicator
- Offer badge (if has pending offer)

## User Flows

1. **View Dashboard**: See stats, quick actions, recent activity
2. **Create Listing**: Click "Neue Anzeige" → Multi-step form → Publish
3. **Edit Listing**: Click edit on card → Form with existing data
4. **Pause/Resume Listing**: Toggle active status
5. **Mark as Sold**: Mark listing as sold
6. **Delete Listing**: Confirm dialog → Delete
7. **View Messages**: See conversations, respond to buyers
8. **Accept/Decline Offer**: Handle price negotiations

## UI Specifications

### Dashboard Header
- Avatar: `w-16 h-16 rounded-2xl` with ring
- Name: `text-2xl font-bold`
- Welcome message below

### Quick Action Cards
- Grid: 2x2 on mobile, 4 columns on desktop
- Primary action: Gradient red background
- Others: White/dark with border
- Hover: Scale slightly, shadow increase

### Stats Cards
- Background: White/dark
- Border: Subtle
- Icon in colored pill (top-right)
- Value: Large, bold
- Label: Small, muted

### Listing Form Steps
- Step indicator: Numbers in circles
- Active: Red/filled
- Completed: Checkmark
- Inactive: Gray/outline

### Form Inputs
- Full-width inputs
- Clear labels
- Helper text where needed
- Validation errors in red below

## Data Types

```typescript
interface Seller {
  id: string
  name: string
  email: string
  avatar: string
  memberSince: string
  isVerified: boolean
}

interface DashboardStats {
  activeListings: number
  totalViews: number
  unreadMessages: number
  pendingOffers: number
  soldThisMonth: number
}

interface QuickAction {
  id: string
  label: string
  icon: 'plus' | 'message' | 'grid' | 'settings'
  action: 'create-listing' | 'open-inbox' | 'view-listings' | 'open-settings'
  badge?: number
}

interface SellerProduct {
  id: string
  title: string
  price: number
  images: string[]
  status: 'aktiv' | 'verkauft' | 'pausiert' | 'abgelaufen'
  views: number
  inquiries: number
  favorites: number
  createdAt: string
}

interface ListingFormData {
  title: string
  description: string
  category: string
  subcategory: string
  price: number
  negotiable: boolean
  images: string[]
  location: { zip: string; city: string; country?: string }
  condition: 'neu' | 'wie-neu' | 'sehr-gut' | 'gut' | 'akzeptabel'
  shippingAvailable: boolean
}

interface Conversation {
  id: string
  productId: string
  productTitle: string
  buyer: { id: string; name: string; avatar: string }
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  hasOffer: boolean
  offerAmount?: number
}
```

## Scope Exclusions

- No payment processing
- No advertising/promotion features
- No shipping label integration

## Acceptance Criteria

- [ ] Dashboard shows seller info and stats
- [ ] Quick actions navigate correctly
- [ ] Listings grid displays seller's products
- [ ] Listing form works through all 4 steps
- [ ] Form validation prevents invalid submissions
- [ ] Listing cards show status and actions
- [ ] Pause/resume/delete actions work
- [ ] Recent activity sections display correctly
- [ ] Dark mode fully supported

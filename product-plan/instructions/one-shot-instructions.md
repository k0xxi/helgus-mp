# HELGUS Marktplatz - Complete Implementation Guide

This document combines all milestone instructions for implementing the complete HELGUS Marktplatz application.

---

## Table of Contents

1. [Foundation](#milestone-01-foundation)
2. [Application Shell](#milestone-02-application-shell)
3. [Produktkatalog & Suche](#milestone-03-produktkatalog--suche)
4. [Produktdetails & Verhandlung](#milestone-04-produktdetails--verhandlung)
5. [Verkäufer-Dashboard](#milestone-05-verkäufer-dashboard)
6. [Nutzerverwaltung](#milestone-06-nutzerverwaltung)

---

## Milestone 01: Foundation

### Objectives

1. Initialize project with React, TypeScript, and Tailwind CSS v4
2. Configure design tokens (colors, typography)
3. Set up data model types
4. Configure routing structure

### Design System

**Colors** (Tailwind built-in):
- Primary: `red` (red-500, red-600, red-700)
- Secondary: `blue` (blue-500, blue-600)
- Neutral: `slate` (slate-50 through slate-950)

**Typography** (Google Fonts):
- Headings: DM Sans (`font-['DM_Sans']`)
- Body: Inter (`font-['Inter']`)
- Code: IBM Plex Mono (`font-['IBM_Plex_Mono']`)

**Dark Mode**: Use `dark:` prefix for all colors.

### Routing Structure

| Route | Section |
|-------|---------|
| `/` | Product Catalog |
| `/product/:id` | Product Details |
| `/dashboard` | Seller Dashboard |
| `/dashboard/listings` | Manage Listings |
| `/dashboard/listings/new` | Create Listing |
| `/auth/login` | Login |
| `/auth/register` | Registration |
| `/profile` | Profile Settings |
| `/profile/verify` | Seller Verification |
| `/user/:id` | Public User Profile |

---

## Milestone 02: Application Shell

### Components

**AppShell**: Layout wrapper with MainNav, full-width content area.

**MainNav**:
- Desktop: Logo left, notifications/favorites/create button/user menu right
- Mobile: Top bar with logo + fixed bottom navigation (5 icons)

**UserMenu**: Dropdown with dashboard link, listings, profile, logout.

### Key Features
- Notification badges (red for notifications, blue for favorites)
- "Anzeige erstellen" CTA button (red)
- User avatar with initials fallback
- Click-outside to close dropdowns

---

## Milestone 03: Produktkatalog & Suche

### Components

**ProductCatalog**: Hero section + two-column layout (filters + grid).

**FilterSidebar**:
- Search input
- Category/subcategory dropdowns
- Price range (min/max)
- ZIP code + radius
- Delivery option
- Condition
- Apply/Reset buttons

**ProductCard**:
- Image with favorite/edit/delete icons
- Title, price, condition badge
- Location, timestamp
- Hover shadow effect

### Layout
- Desktop: 3 columns
- Tablet: 2 columns
- Mobile: 1 column + filter drawer

---

## Milestone 04: Produktdetails & Verhandlung

### Components

**ProductDetail**: Sticky header, breadcrumb, two-column layout.

**ImageGallery**: Main image + clickable thumbnails.

**SellerCard**: Avatar, name, verified badge, location, stats, message button.

**ChatDrawer**: Slide-out panel with message history and input.

**OfferModal**: Form for counter-offer amount and optional message.

**NotificationDropdown**: Bell icon with badge, notification list, mark as read.

### Key Features
- Breadcrumb navigation
- Counter-offer system
- Real-time chat UI
- Action buttons: Buy, Favorite, Share

---

## Milestone 05: Verkäufer-Dashboard

### Components

**SellerDashboard**: Header, quick actions (2x2 grid), stats cards, recent activity.

**ListingsGrid**: Filterable grid of seller's listings.

**ListingCard**: Image, title, price, status badge, stats, action menu.

**ListingForm**: 4-step form:
1. Basic info (title, description, category, price)
2. Images (upload, reorder)
3. Location (ZIP, city, country)
4. Options (condition, shipping)

### Key Features
- Quick action buttons with badges
- Stats cards with colored icons
- Multi-step form with validation
- Listing status management (pause, sell, delete)

---

## Milestone 06: Nutzerverwaltung

### Components

**AuthPage**: Tab-based login/registration container.

**LoginForm**: Email, password, remember me, social login, forgot password link.

**RegistrationForm**: Name, email, password (with strength indicator), terms checkboxes.

**ProfileSettings**: Tabs for personal data, address, notifications, security.

**PasswordReset**: Request mode (email) and reset mode (new password).

**ChangePassword**: Current password, new password, confirmation.

**SellerVerificationForm**: 4-step flow:
1. Overview (benefits)
2. Address data
3. Bank details (IBAN with validation)
4. Confirmation

**PublicProfile**: Avatar, name, verified badge, bio, listings grid.

### Validation
- Email format
- Password: 8+ chars, 1 number, 1 special char
- IBAN: Country-specific format and check digit

---

## Data Model Summary

### Core Entities

```typescript
interface User {
  id: string
  email: string
  name: string
  avatar?: string
  memberSince: string
  isVerified: boolean
}

interface Product {
  id: string
  title: string
  price: number
  description: string
  images: string[]
  condition: string
  sellerId: string
  categoryId: string
}

interface Category {
  id: string
  name: string
  subcategories: Subcategory[]
}

interface Message {
  id: string
  productId: string
  senderId: string
  content: string
  timestamp: string
}

interface Offer {
  id: string
  productId: string
  buyerId: string
  amount: number
  status: 'pending' | 'accepted' | 'declined'
}

interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  isRead: boolean
}
```

---

## Implementation Checklist

### Foundation
- [ ] Project setup with TypeScript + Tailwind v4
- [ ] Google Fonts configured
- [ ] Routing structure
- [ ] Core types defined
- [ ] Dark mode working

### Shell
- [ ] AppShell component
- [ ] Desktop navigation
- [ ] Mobile bottom navigation
- [ ] User menu dropdown
- [ ] Notification badges

### Product Catalog
- [ ] Product grid (responsive)
- [ ] Filter sidebar
- [ ] Sort dropdown
- [ ] Product cards
- [ ] Empty state

### Product Details
- [ ] Image gallery
- [ ] Product info display
- [ ] Counter-offer modal
- [ ] Chat drawer
- [ ] Notification dropdown

### Seller Dashboard
- [ ] Dashboard overview
- [ ] Quick actions
- [ ] Stats cards
- [ ] Listings grid
- [ ] Multi-step listing form

### User Management
- [ ] Login/Registration forms
- [ ] Profile settings
- [ ] Password management
- [ ] Seller verification flow
- [ ] Public profile page

---

## Technical Notes

1. **All components are props-based** - no direct data imports
2. **Tailwind CSS v4** - no tailwind.config.js
3. **German language** - all UI text in German
4. **Icons** - use lucide-react
5. **Dark mode** - use `dark:` variants everywhere
6. **Mobile-first** - responsive at all breakpoints

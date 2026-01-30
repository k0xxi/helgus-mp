# Milestone 01: Foundation

Set up the project foundation with design system, data model types, and base configuration.

## Objectives

1. Initialize project with React, TypeScript, and Tailwind CSS v4
2. Configure design tokens (colors, typography)
3. Set up data model types
4. Configure routing structure

## Design System Setup

### Colors

Use Tailwind's built-in color utilities:

| Role | Tailwind Color |
|------|----------------|
| Primary | `red` (red-500, red-600, red-700, etc.) |
| Secondary | `blue` (blue-500, blue-600, etc.) |
| Neutral | `slate` (slate-50 through slate-950) |

### Typography

Add Google Fonts to your project:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

Usage:
- **Headings**: `font-['DM_Sans']`
- **Body**: `font-['Inter']`
- **Code/Mono**: `font-['IBM_Plex_Mono']`

### Dark Mode

Use Tailwind's `dark:` prefix for all color utilities. Support both light and dark modes.

## Data Model Types

Create the core type definitions based on the data model. See `data-model/` folder for complete types.

### Core Entities

```typescript
// User entity
interface User {
  id: string
  email: string
  name: string
  avatar?: string
  memberSince: string
  isVerified: boolean
}

// Product entity
interface Product {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  condition: 'neu' | 'wie-neu' | 'sehr-gut' | 'gut' | 'akzeptabel'
  sellerId: string
  categoryId: string
  createdAt: string
}

// Category entity
interface Category {
  id: string
  name: string
  slug: string
  subcategories: Subcategory[]
}

// Message entity
interface Message {
  id: string
  productId: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  isRead: boolean
}

// Offer entity
interface Offer {
  id: string
  productId: string
  buyerId: string
  amount: number
  status: 'pending' | 'accepted' | 'declined'
  createdAt: string
}

// Notification entity
interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  timestamp: string
  isRead: boolean
}
```

## Routing Structure

Set up routes for the application:

| Route | Section |
|-------|---------|
| `/` | Product Catalog (Produktkatalog & Suche) |
| `/product/:id` | Product Details (Produktdetails & Verhandlung) |
| `/dashboard` | Seller Dashboard (Verkäufer-Dashboard) |
| `/dashboard/listings` | Manage Listings |
| `/dashboard/listings/new` | Create Listing |
| `/dashboard/inbox` | Messages Inbox |
| `/auth/login` | Login |
| `/auth/register` | Registration |
| `/profile` | Profile Settings (Nutzerverwaltung) |
| `/profile/verify` | Seller Verification |
| `/user/:id` | Public User Profile |

## Dependencies

Recommended packages:
- React 18+
- TypeScript 5+
- Tailwind CSS v4
- React Router (or Next.js App Router)
- lucide-react (for icons)

## Acceptance Criteria

- [ ] Project initialized with TypeScript and Tailwind CSS v4
- [ ] Google Fonts loaded (DM Sans, Inter, IBM Plex Mono)
- [ ] Design tokens accessible via Tailwind utilities
- [ ] Core data model types defined
- [ ] Routing structure configured
- [ ] Dark mode support working

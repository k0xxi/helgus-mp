# Milestone 03: Produktkatalog & Suche

Build the product catalog with filtering, sorting, and product cards.

## Overview

The product catalog is the main landing page where users browse and filter products. It's publicly accessible (no login required for browsing).

## Components to Build

### 1. ProductCatalog

Main container component for the catalog page.

**File**: `components/sections/produktkatalog-suche/ProductCatalog.tsx`

**Props**:
```typescript
interface ProductCatalogProps {
  products: Product[]
  categories: Category[]
  filters?: ProductFilters
  sortBy?: SortOption
  onApplyFilters?: (filters: ProductFilters) => void
  onResetFilters?: () => void
  onSortChange?: (sortBy: SortOption) => void
  onViewProduct?: (productId: string) => void
  onToggleFavorite?: (productId: string) => void
  onEditProduct?: (productId: string) => void
  onDeleteProduct?: (productId: string) => void
}
```

**Layout**:
- Hero section with gradient background, badge, heading, description
- Two-column layout: FilterSidebar (left, ~320px) + Product Grid (right)
- Mobile: Filter as slide-out drawer, single-column grid

### 2. FilterSidebar

Filter controls component.

**File**: `components/sections/produktkatalog-suche/FilterSidebar.tsx`

**Filter Fields**:
- Search input: "Was suchst du?"
- Category dropdown with subcategories
- Price range: Min/Max inputs in Euro
- Location: ZIP code + Radius dropdown (10km, 25km, 50km, 100km, 200km)
- Delivery: Alle / Nur Abholung / Nur Versand
- Condition: Alle / Neu / Wie neu / Sehr gut / Gut / Akzeptabel

**Buttons**:
- "Filter anwenden" (primary, full-width)
- "Filter zurücksetzen" (text link below)

### 3. ProductCard

Individual product display card.

**File**: `components/sections/produktkatalog-suche/ProductCard.tsx`

**Elements**:
- Image container (4:3 aspect ratio, object-cover)
- Favorite button (heart icon, top-right over image)
- Edit/Delete icons (only for own products)
- "Neu" badge (if product < 24h old)
- Product title (2 lines max, truncate)
- Price (red-600, bold, large)
- Condition badge (pill style)
- Delivery option icons
- Location (ZIP code)
- Timestamp ("vor 1 Std.", "vor 3 Tagen")

**Interactions**:
- Click card → `onViewProduct`
- Click heart → `onToggleFavorite`
- Click edit → `onEditProduct`
- Click delete → `onDeleteProduct`

## User Flows

1. **Browse Products**: User sees all products in grid
2. **Filter Products**: User applies filters → products update
3. **Sort Products**: User changes sort → products reorder immediately
4. **Favorite Product**: User clicks heart → visual feedback
5. **View Product**: User clicks card → navigate to detail page
6. **Edit Own Product**: Owner clicks edit icon → navigate to edit form
7. **Delete Own Product**: Owner clicks delete → confirmation modal

## UI Specifications

### Hero Section
- Background: `bg-gradient-to-br from-red-50 to-pink-50 dark:from-slate-800 dark:to-slate-900`
- Badge: `bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300`
- Heading: `text-4xl sm:text-5xl font-bold font-['DM_Sans']`

### Filter Sidebar
- Background: `bg-white dark:bg-slate-800`
- Border: `border border-slate-200 dark:border-slate-700`
- Inputs: Standard form inputs with focus ring

### Product Grid
- Desktop (>1200px): 3 columns
- Tablet (768-1200px): 2 columns
- Mobile (<768px): 1 column
- Gap: 24px

### Product Card
- Background: `bg-white dark:bg-slate-800`
- Border: `border border-slate-200 dark:border-slate-700`
- Hover: `hover:shadow-lg` with smooth transition
- Price: `text-red-600 dark:text-red-500 text-2xl font-bold`

### Empty State
- Large icon (empty box or magnifying glass)
- "Keine Produkte gefunden" heading
- Helpful text suggesting filter changes
- Optional "Filter zurücksetzen" button

## Data Types

```typescript
interface Product {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  condition: 'neu' | 'wie-neu' | 'sehr-gut' | 'gut' | 'akzeptabel'
  deliveryOptions: ('abholung' | 'versand')[]
  location: { zip: string; city: string }
  seller: { id: string; name: string; rating: number }
  category: string
  subcategory: string
  createdAt: string
  phoneContactAvailable: boolean
  isFavorited: boolean
  isOwn: boolean
}

interface ProductFilters {
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

type SortOption = 'newest' | 'price-asc' | 'price-desc'
```

## Acceptance Criteria

- [ ] Product grid displays with responsive columns
- [ ] Filters update product list when applied
- [ ] Sort dropdown reorders products immediately
- [ ] Mobile filter drawer works correctly
- [ ] Product cards show all required information
- [ ] Favorite toggle provides visual feedback
- [ ] Own products show edit/delete icons
- [ ] Empty state displays when no products match
- [ ] Dark mode fully supported

# Tests: Produktkatalog & Suche

## Component Tests

### ProductCatalog

#### Rendering
- [ ] Renders hero section with badge, heading, and description
- [ ] Renders filter sidebar on desktop
- [ ] Renders product grid with correct number of columns
- [ ] Shows "X Produkte gefunden" count
- [ ] Displays sort dropdown with all options

#### Empty State
- [ ] Shows empty state when products array is empty
- [ ] Empty state has icon, heading, and helper text
- [ ] Shows "Filter zurücksetzen" button when onResetFilters provided

#### Mobile
- [ ] Filter sidebar hidden on mobile
- [ ] Mobile filter button visible
- [ ] Filter drawer opens when button clicked
- [ ] Filter drawer closes when backdrop clicked
- [ ] Filter drawer closes after applying filters

### FilterSidebar

#### Rendering
- [ ] Shows all filter fields (search, category, price, location, delivery, condition)
- [ ] Category dropdown populated with provided categories
- [ ] Subcategory dropdown appears when category selected
- [ ] Subcategories match selected category

#### Interactions
- [ ] Search input updates filter state
- [ ] Category selection updates filter state
- [ ] Subcategory resets when category changes
- [ ] Price inputs accept numbers only
- [ ] ZIP code input accepts text
- [ ] Radius dropdown shows all options (10, 25, 50, 100, 200)
- [ ] "Filter anwenden" calls onApplyFilters with current state
- [ ] "Filter zurücksetzen" clears all filters and calls onResetFilters

### ProductCard

#### Rendering
- [ ] Shows product image (or fallback icon if no image)
- [ ] Shows product title (max 2 lines, truncated)
- [ ] Shows price in red with Euro symbol
- [ ] Shows condition badge with correct color
- [ ] Shows delivery option icon and text
- [ ] Shows phone contact indicator if available
- [ ] Shows location (ZIP code)
- [ ] Shows relative timestamp

#### New Badge
- [ ] Shows "NEU" badge for products < 24 hours old
- [ ] Does not show "NEU" badge for older products

#### Favorite Button
- [ ] Shows heart icon (not for own products)
- [ ] Heart filled when isFavorited is true
- [ ] Clicking heart calls onToggleFavorite
- [ ] Click does not trigger onView

#### Own Product Actions
- [ ] Shows edit/delete icons for isOwn=true products
- [ ] Does not show favorite icon for own products
- [ ] Clicking edit calls onEdit
- [ ] Clicking delete calls onDelete
- [ ] Clicks do not trigger onView

#### Interactions
- [ ] Clicking card calls onView
- [ ] Hover shows shadow effect

## Integration Tests

### Filter Flow
1. [ ] User applies category filter → grid updates
2. [ ] User applies price range → grid shows filtered results
3. [ ] User applies multiple filters → all filters combined
4. [ ] User resets filters → all products shown

### Sort Flow
1. [ ] Default sort is "Neueste zuerst"
2. [ ] Changing to "Preis aufsteigend" reorders products
3. [ ] Changing to "Preis absteigend" reorders products
4. [ ] Sort change is immediate (no button click needed)

### Favorite Flow
1. [ ] Click favorite on product → visual feedback
2. [ ] Favorited products show filled heart
3. [ ] Un-favoriting shows outline heart

### Navigation Flow
1. [ ] Click product card → onViewProduct called with product ID
2. [ ] Click edit on own product → onEditProduct called
3. [ ] Click delete on own product → onDeleteProduct called

## Accessibility Tests

- [ ] All interactive elements are keyboard accessible
- [ ] Filter inputs have proper labels
- [ ] Images have alt text
- [ ] Color contrast meets WCAG AA
- [ ] Focus states are visible

## Responsive Tests

### Desktop (>1200px)
- [ ] 3-column grid
- [ ] Sidebar visible

### Tablet (768-1200px)
- [ ] 2-column grid
- [ ] Sidebar visible (narrower)

### Mobile (<768px)
- [ ] 1-column grid
- [ ] Filter button instead of sidebar
- [ ] Larger touch targets

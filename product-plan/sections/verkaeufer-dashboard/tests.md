# Tests: Verkäufer-Dashboard

## Component Tests

### SellerDashboard

#### Rendering
- [ ] Shows seller avatar and name
- [ ] Displays verified badge if seller is verified
- [ ] Shows welcome message with first name
- [ ] Renders 4 quick action buttons
- [ ] Displays 4 stat cards
- [ ] Shows "Letzte Nachrichten" section
- [ ] Shows "Deine Anzeigen" section
- [ ] Shows pending offers banner if pendingOffers > 0

#### Quick Actions
- [ ] "Neue Anzeige" button has plus icon (primary style)
- [ ] "Nachrichten" button shows badge with unread count
- [ ] "Meine Anzeigen" button has grid icon
- [ ] "Einstellungen" button has settings icon

#### Stats Cards
- [ ] "Aktive Anzeigen" shows count with blue accent
- [ ] "Gesamtaufrufe" shows formatted number
- [ ] "Offene Nachrichten" shows red accent if > 0
- [ ] "Verkauft (Monat)" shows green accent

#### Interactions
- [ ] Quick action clicks call onQuickAction with action type
- [ ] Conversation click calls onViewConversation
- [ ] Product click calls onViewProduct
- [ ] "Alle Nachrichten" calls onQuickAction('open-inbox')
- [ ] "Alle Anzeigen" calls onQuickAction('view-listings')

### ListingsGrid

#### Rendering
- [ ] Shows grid of listing cards
- [ ] Responsive columns (3/2/1)
- [ ] Empty state when no products
- [ ] Empty state has CTA to create listing

#### Status Filtering
- [ ] Shows all listings by default
- [ ] Can filter by active/sold/paused
- [ ] Count updates with filter

### ListingCard

#### Rendering
- [ ] Shows product image
- [ ] Shows product title (truncated)
- [ ] Shows price
- [ ] Shows status badge with correct color
- [ ] Shows view count
- [ ] Shows inquiry count
- [ ] Shows action menu trigger

#### Status Colors
- [ ] Aktiv: green
- [ ] Verkauft: gray
- [ ] Pausiert: amber
- [ ] Abgelaufen: red

#### Actions Menu
- [ ] Opens on click
- [ ] "Ansehen" option
- [ ] "Bearbeiten" option
- [ ] "Pausieren/Aktivieren" toggle
- [ ] "Als verkauft markieren" option
- [ ] "Löschen" option (red)

### ListingForm

#### Step Navigation
- [ ] Shows step indicator (1-4)
- [ ] Active step highlighted
- [ ] Completed steps show checkmark
- [ ] Back button works (except step 1)
- [ ] Next button validates before proceeding

#### Step 1: Basis-Infos
- [ ] Title input (required)
- [ ] Description textarea (required)
- [ ] Category dropdown (required)
- [ ] Subcategory dropdown (appears after category)
- [ ] Price input (required, number)
- [ ] Negotiable checkbox

#### Step 2: Bilder
- [ ] Image upload area
- [ ] Shows uploaded images
- [ ] Can reorder images
- [ ] Can delete images
- [ ] At least 1 image required

#### Step 3: Standort
- [ ] ZIP input
- [ ] City input
- [ ] Country selector (AT, DE, CH)
- [ ] ZIP validation based on country

#### Step 4: Optionen
- [ ] Condition dropdown (required)
- [ ] Shipping available toggle
- [ ] Summary of all data
- [ ] "Anzeige veröffentlichen" button

#### Form Submission
- [ ] Validates all required fields
- [ ] Shows errors for invalid fields
- [ ] Calls onSubmit with complete data
- [ ] Cancel button calls onCancel

## Integration Tests

### Dashboard Navigation
1. [ ] Click "Neue Anzeige" → opens listing form
2. [ ] Click "Nachrichten" → opens inbox
3. [ ] Click "Meine Anzeigen" → shows listings grid
4. [ ] Click "Einstellungen" → opens settings

### Create Listing Flow
1. [ ] Fill step 1 → click next
2. [ ] Upload images → click next
3. [ ] Fill location → click next
4. [ ] Select options → publish
5. [ ] Success → redirect to listings

### Edit Listing Flow
1. [ ] Click edit on listing → form with data
2. [ ] Modify fields → save
3. [ ] Changes reflected in grid

### Listing Management
1. [ ] Pause active listing → status changes to "Pausiert"
2. [ ] Resume paused listing → status changes to "Aktiv"
3. [ ] Mark as sold → status changes to "Verkauft"
4. [ ] Delete listing → confirmation → removed from grid

### Message Flow
1. [ ] Click conversation → open messages
2. [ ] Reply to message → sent
3. [ ] Accept offer → status updated
4. [ ] Decline offer → status updated

## Accessibility Tests

- [ ] Form fields have labels
- [ ] Error messages announced
- [ ] Step navigation keyboard accessible
- [ ] Modal focus trapped
- [ ] Color contrast meets WCAG AA

## Responsive Tests

### Desktop (>1024px)
- [ ] Full dashboard layout
- [ ] Side-by-side message/listings panels
- [ ] 3-column listing grid

### Tablet (768-1024px)
- [ ] Stacked panels
- [ ] 2-column listing grid

### Mobile (<768px)
- [ ] Single column
- [ ] 1-column listing grid
- [ ] Bottom sheet for actions

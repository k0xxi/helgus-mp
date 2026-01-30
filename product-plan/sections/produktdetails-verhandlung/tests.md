# Tests: Produktdetails & Verhandlung

## Component Tests

### ProductDetail

#### Rendering
- [ ] Shows sticky header with back button and notifications
- [ ] Renders breadcrumb with category path
- [ ] Shows product title and price
- [ ] Displays "Gegenangebot machen" button
- [ ] Shows condition, location, and date badges
- [ ] Renders shipping options card
- [ ] Shows product description
- [ ] Renders seller card
- [ ] Shows action buttons (Kaufen, Favorit, Teilen)
- [ ] Displays view count

#### Layout
- [ ] Two-column layout on desktop (images left, details right)
- [ ] Single column on mobile (stacked)

### ImageGallery

#### Rendering
- [ ] Shows main image
- [ ] Shows thumbnail row below main image
- [ ] Highlights active thumbnail

#### Interactions
- [ ] Clicking thumbnail changes main image
- [ ] Smooth transition between images
- [ ] Shows fallback for missing images

### SellerCard

#### Rendering
- [ ] Shows seller avatar (or initials)
- [ ] Displays seller name
- [ ] Shows verified badge if isVerified
- [ ] Shows location (city)
- [ ] Shows "Mitglied seit" date
- [ ] Displays rating
- [ ] Shows total sales count
- [ ] Shows response time

#### Interactions
- [ ] "Nachricht senden" button opens chat drawer
- [ ] Clicking seller info calls onViewSellerProfile

### ChatDrawer

#### Rendering
- [ ] Drawer slides in from right
- [ ] Shows header with seller info
- [ ] Displays message history
- [ ] Own messages aligned right (blue)
- [ ] Other messages aligned left (gray)
- [ ] Shows input field and send button

#### Interactions
- [ ] Close button closes drawer
- [ ] Clicking backdrop closes drawer
- [ ] Typing in input updates state
- [ ] Send button calls onSendMessage
- [ ] Enter key sends message
- [ ] Auto-scrolls to bottom on new message

### OfferModal

#### Rendering
- [ ] Shows product title
- [ ] Shows original price
- [ ] Has amount input field
- [ ] Has optional message textarea
- [ ] Shows "Angebot senden" button
- [ ] Shows "Abbrechen" button

#### Validation
- [ ] Amount must be greater than 0
- [ ] Shows warning if offer > original price
- [ ] Disabled submit if amount invalid

#### Interactions
- [ ] Cancel closes modal
- [ ] Submit calls onMakeOffer with amount and message
- [ ] Modal closes after successful submit

### NotificationDropdown

#### Rendering
- [ ] Shows bell icon
- [ ] Badge shows unread count
- [ ] Badge shows "9+" if count > 9
- [ ] Dropdown lists notifications
- [ ] Different icons for notification types
- [ ] Unread notifications highlighted

#### Interactions
- [ ] Click bell opens dropdown
- [ ] Click outside closes dropdown
- [ ] Click notification calls onNotificationClick
- [ ] "Als gelesen markieren" updates notification
- [ ] "Alle als gelesen" marks all read

## Integration Tests

### Image Gallery Flow
1. [ ] Page loads with first image as main
2. [ ] Click second thumbnail → main image changes
3. [ ] Active thumbnail shows highlight

### Chat Flow
1. [ ] Click "Nachricht senden" → drawer opens
2. [ ] Type message → input shows text
3. [ ] Click send → message appears in list
4. [ ] Close drawer → drawer slides out

### Offer Flow
1. [ ] Click "Gegenangebot machen" → modal opens
2. [ ] Enter amount and message
3. [ ] Submit → onMakeOffer called
4. [ ] Modal closes

### Navigation Flow
1. [ ] Click "Zurück" → onBack called
2. [ ] Click breadcrumb category → onCategoryClick called
3. [ ] Click "Kaufen" → onBuyRequest called
4. [ ] Click favorite → onToggleFavorite called
5. [ ] Click share → onShare called

### Notification Flow
1. [ ] Click bell → dropdown opens
2. [ ] Click notification → onNotificationClick called
3. [ ] Mark as read → notification no longer bold
4. [ ] Mark all read → badge disappears

## Accessibility Tests

- [ ] All images have alt text
- [ ] Modal is focus-trapped
- [ ] Escape key closes modal and drawer
- [ ] Chat messages have proper ARIA roles
- [ ] Color contrast meets WCAG AA

## Responsive Tests

### Desktop (>1024px)
- [ ] Two-column layout
- [ ] Chat drawer as side panel

### Tablet (768-1024px)
- [ ] Two-column layout (narrower)
- [ ] Chat drawer as overlay

### Mobile (<768px)
- [ ] Single column layout
- [ ] Full-screen chat drawer
- [ ] Larger touch targets

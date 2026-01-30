# Produktdetails & Verhandlung

Product detail page with image gallery, counter-offer system, and messaging.

## Components

| Component | Description |
|-----------|-------------|
| `ProductDetail` | Main container with layout and all sub-components |
| `ImageGallery` | Image carousel with thumbnails |
| `SellerCard` | Seller info card with contact button |
| `ChatDrawer` | Slide-out messaging panel |
| `OfferModal` | Modal for making counter-offers |
| `NotificationDropdown` | Notifications bell with dropdown |

## Files

- `types.ts` - TypeScript interfaces
- `data.json` - Sample data
- `tests.md` - Test specifications
- `components/` - Component implementations

## Callbacks

| Callback | Description |
|----------|-------------|
| `onBack` | Navigate back |
| `onCategoryClick` | Navigate to category |
| `onMakeOffer` | Submit counter-offer |
| `onBuyRequest` | Initiate purchase |
| `onToggleFavorite` | Toggle favorite status |
| `onShare` | Share product |
| `onSendMessage` | Send chat message |
| `onViewSellerProfile` | View seller's profile |
| `onMarkNotificationRead` | Mark notification as read |
| `onMarkAllNotificationsRead` | Mark all notifications as read |
| `onNotificationClick` | Handle notification click |
| `onAcceptOffer` | Accept a counter-offer (seller view) |
| `onDeclineOffer` | Decline a counter-offer (seller view) |

## Design Decisions

- **Image Gallery**: Thumbnails below main image for easy browsing
- **Chat Drawer**: Slides from right, full-screen on mobile
- **Counter-Offer Modal**: Centered modal with amount input and optional message
- **Breadcrumb**: Click-able category hierarchy for navigation
- **Notification Types**: Visual distinction by icon and color for different events
- **Price Display**: Large, red for emphasis with proper Euro formatting

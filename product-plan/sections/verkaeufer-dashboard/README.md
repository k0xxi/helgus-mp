# Verkäufer-Dashboard

Seller dashboard for managing listings, viewing stats, and communicating with buyers.

## Components

| Component | Description |
|-----------|-------------|
| `SellerDashboard` | Main dashboard with stats and quick actions |
| `ListingsGrid` | Grid display of seller's listings |
| `ListingCard` | Individual listing card with actions |
| `ListingForm` | Multi-step form for creating/editing listings |

## Files

- `types.ts` - TypeScript interfaces
- `data.json` - Sample data
- `tests.md` - Test specifications
- `components/` - Component implementations

## Callbacks

### SellerDashboard
| Callback | Description |
|----------|-------------|
| `onQuickAction` | Handle quick action button clicks |
| `onViewConversation` | Open a conversation |
| `onViewProduct` | View a product listing |

### ListingsGrid
| Callback | Description |
|----------|-------------|
| `onView` | View listing details |
| `onEdit` | Edit listing |
| `onDelete` | Delete listing |
| `onTogglePause` | Pause/unpause listing |
| `onMarkAsSold` | Mark as sold |
| `onCreate` | Create new listing |

### ListingForm
| Callback | Description |
|----------|-------------|
| `onSubmit` | Submit completed form |
| `onCancel` | Cancel form |
| `onNextStep` | Navigate to next step |
| `onPrevStep` | Navigate to previous step |

## Design Decisions

- **Quick Actions**: 2x2 grid with primary action (new listing) highlighted
- **Stats Cards**: Colored accents for visual distinction
- **Multi-Step Form**: 4 steps with clear progress indicator
- **Status Badges**: Color-coded (green=active, amber=paused, gray=sold, red=expired)
- **Recent Activity**: Split into messages and listings for quick overview
- **Country Selector**: Support for AT, DE, CH with country-specific ZIP validation

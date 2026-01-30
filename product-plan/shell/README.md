# Application Shell

Persistent navigation and layout wrapper for the application.

## Components

| Component | Description |
|-----------|-------------|
| `AppShell` | Main layout wrapper with navigation |
| `MainNav` | Top navigation bar (desktop) + bottom nav (mobile) |
| `UserMenu` | User dropdown menu |

## Files

- `components/` - Component implementations
- `spec.md` - Shell specification

## Props

### AppShell
| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Page content |
| `navigationItems` | `NavigationItem[]` | Nav items |
| `user` | `User?` | Logged-in user |
| `onNavigate` | `(href) => void` | Navigation handler |
| `onLogout` | `() => void` | Logout handler |
| `notificationCount` | `number` | Unread notifications |
| `favoritesCount` | `number` | Favorites count |
| `onCreateListing` | `() => void` | Create listing handler |
| `onNotificationsClick` | `() => void` | Notifications handler |
| `onFavoritesClick` | `() => void` | Favorites handler |
| `variant` | `'public' \| 'dashboard'` | Shell variant |

### UserMenu
| Prop | Type | Description |
|------|------|-------------|
| `user` | `User` | Current user |
| `onLogout` | `() => void` | Logout handler |
| `onNavigate` | `(href) => void` | Navigation handler |

## Navigation Structure

### Desktop (>768px)
- Top navigation bar
- Logo left, icons/actions right
- User menu dropdown

### Mobile (<768px)
- Minimal top bar with logo only
- Fixed bottom navigation with 5 icons:
  - Home
  - Search
  - Create (elevated, red)
  - Favorites
  - Profile

## Design Decisions

- **Hybrid Design**: Simple top nav for browsing, sidebar for dashboard (future)
- **Mobile Bottom Nav**: Better thumb accessibility
- **User Menu Dropdown**: Click-outside to close, smooth animation
- **Notification Badges**: Red for notifications, blue for favorites
- **Create CTA**: Prominent red button, elevated on mobile

# Milestone 02: Application Shell

Build the persistent navigation and layout wrapper that surrounds all sections.

## Overview

HELGUS uses a hybrid shell design:
- **Public Areas** (Product Catalog): Top navigation for easy browsing
- **Dashboard Areas** (Seller Dashboard): Could use sidebar navigation for structured management

## Components to Build

### 1. AppShell

The main layout wrapper component.

**File**: `components/shell/AppShell.tsx`

**Props**:
```typescript
interface AppShellProps {
  children: React.ReactNode
  navigationItems: NavigationItem[]
  user?: User
  onNavigate?: (href: string) => void
  onLogout?: () => void
  notificationCount?: number
  favoritesCount?: number
  onCreateListing?: () => void
  onNotificationsClick?: () => void
  onFavoritesClick?: () => void
  variant?: 'public' | 'dashboard'
}
```

**Behavior**:
- Renders MainNav at the top
- Full-width content area for children
- Minimum height screen with slate-50/slate-900 background

### 2. MainNav

The main navigation bar component.

**File**: `components/shell/MainNav.tsx`

**Desktop Layout** (>1024px):
- Logo "HELGUS" on the left (red-600, DM Sans, bold)
- Right side: Notifications (bell icon), Favorites (heart icon), "Anzeige erstellen" button, User Menu
- White background with bottom border

**Tablet Layout** (768-1024px):
- Compact navigation with icons (no text labels)
- Smaller button for "Anzeige erstellen" (just plus icon)

**Mobile Layout** (<768px):
- Minimal top bar with just logo
- Fixed bottom navigation bar with 5 icons:
  - Home (house icon)
  - Search (magnifying glass)
  - Create Listing (plus icon, highlighted/elevated)
  - Favorites (heart icon)
  - Profile (user icon)

**Badge System**:
- Notification count badge (red-600, top-right of bell icon)
- Favorites count badge (blue-600, top-right of heart icon)
- Show "9+" if count > 9

### 3. UserMenu

Dropdown menu for logged-in users.

**File**: `components/shell/UserMenu.tsx`

**Trigger**: Avatar/Initials + Name (desktop) + Chevron

**Dropdown Items**:
- User info section (name, role badge)
- "Mein Dashboard" (only for sellers) → `/dashboard`
- "Meine Anzeigen" → `/my-listings`
- "Profil & Einstellungen" → `/profile`
- Divider
- "Abmelden" (logout, red text)

**Behavior**:
- Click outside to close
- Smooth fade-in/slide-down animation
- Generate initials from name if no avatar

## Design Specifications

### Colors
- Logo: `text-red-600 dark:text-red-500`
- Icons: `text-slate-600 dark:text-slate-300`
- Icon hover: `hover:text-red-600 dark:hover:text-red-400`
- Create button: `bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600`
- Background: `bg-white dark:bg-slate-800`
- Border: `border-slate-200 dark:border-slate-700`

### Typography
- Logo: `font-['DM_Sans'] font-bold text-2xl`
- Nav items: `font-['Inter'] text-sm font-medium`
- User name: `font-['Inter'] text-sm font-medium`

### Icons
Use lucide-react:
- `Bell` for notifications
- `Heart` for favorites
- `Plus` for create listing
- `Home`, `Search`, `User` for mobile nav
- `ChevronDown` for dropdown
- `LayoutDashboard`, `Package`, `Settings`, `LogOut` for menu items

## Implementation Notes

1. Use `useState` and `useRef` for dropdown open/close state
2. Add click-outside listener with `useEffect`
3. Mobile bottom nav should be fixed with `fixed bottom-0 left-0 right-0`
4. Add spacer div on mobile to prevent content from hiding behind bottom nav
5. All navigation should go through `onNavigate` callback

## Acceptance Criteria

- [ ] AppShell wraps content with navigation
- [ ] Desktop navigation shows all elements
- [ ] Mobile shows top bar + bottom navigation
- [ ] User menu dropdown works correctly
- [ ] Notification/favorites badges display correctly
- [ ] Dark mode fully supported
- [ ] All callbacks properly wired

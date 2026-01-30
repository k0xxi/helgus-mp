# Color Palette

HELGUS Marktplatz uses Tailwind CSS's built-in color utilities. No custom colors are defined.

## Primary: Red

The primary brand color used for CTAs, active states, and emphasis.

| Use Case | Light Mode | Dark Mode |
|----------|------------|-----------|
| Button background | `bg-red-600` | `dark:bg-red-500` |
| Button hover | `hover:bg-red-700` | `dark:hover:bg-red-600` |
| Text accent | `text-red-600` | `dark:text-red-500` |
| Price display | `text-red-600` | `dark:text-red-500` |
| Logo | `text-red-600` | `dark:text-red-500` |
| Badge background | `bg-red-100` | `dark:bg-red-900/30` |
| Badge text | `text-red-700` | `dark:text-red-300` |

## Secondary: Blue

Used for secondary actions, links, and informational elements.

| Use Case | Light Mode | Dark Mode |
|----------|------------|-----------|
| Secondary button | `bg-blue-600` | `dark:bg-blue-600` |
| Button hover | `hover:bg-blue-700` | `dark:hover:bg-blue-700` |
| Link text | `text-blue-600` | `dark:text-blue-400` |
| Verified badge | `bg-blue-100 text-blue-700` | `dark:bg-blue-900/30 dark:text-blue-400` |
| Offer button | `bg-blue-600` | `dark:bg-blue-600` |
| Chat bubbles (own) | `bg-blue-600` | `dark:bg-blue-600` |
| Favorites badge | `bg-blue-600` | `dark:bg-blue-600` |

## Neutral: Slate

Used for backgrounds, borders, and text throughout the interface.

### Backgrounds

| Use Case | Light Mode | Dark Mode |
|----------|------------|-----------|
| Page background | `bg-slate-50` | `dark:bg-slate-900` |
| Card/surface | `bg-white` | `dark:bg-slate-800` |
| Input background | `bg-white` | `dark:bg-slate-800` |
| Hover state | `hover:bg-slate-100` | `dark:hover:bg-slate-700` |
| Muted surface | `bg-slate-100` | `dark:bg-slate-700` |

### Borders

| Use Case | Light Mode | Dark Mode |
|----------|------------|-----------|
| Card border | `border-slate-200` | `dark:border-slate-700` |
| Input border | `border-slate-300` | `dark:border-slate-600` |
| Divider | `border-slate-200` | `dark:border-slate-700` |

### Text

| Use Case | Light Mode | Dark Mode |
|----------|------------|-----------|
| Heading | `text-slate-900` | `dark:text-white` |
| Body text | `text-slate-700` | `dark:text-slate-300` |
| Secondary text | `text-slate-600` | `dark:text-slate-400` |
| Muted text | `text-slate-500` | `dark:text-slate-400` |
| Placeholder | `text-slate-400` | `dark:text-slate-500` |
| Disabled | `text-slate-400` | `dark:text-slate-600` |

## Semantic Colors

For status and feedback, use Tailwind's semantic colors:

| Status | Color | Example Usage |
|--------|-------|---------------|
| Success | `green` | `bg-green-100 text-green-700` / `dark:bg-green-900/30 dark:text-green-400` |
| Warning | `amber` | `bg-amber-100 text-amber-700` / `dark:bg-amber-900/30 dark:text-amber-400` |
| Error | `red` | `text-red-600` / `dark:text-red-400` |
| Info | `blue` | `bg-blue-100 text-blue-700` / `dark:bg-blue-900/30 dark:text-blue-400` |

## Condition Badges

| Condition | Light Mode | Dark Mode |
|-----------|------------|-----------|
| Neu (New) | `bg-green-100 text-green-700` | `dark:bg-green-900/30 dark:text-green-400` |
| Wie neu | `bg-blue-100 text-blue-700` | `dark:bg-blue-900/30 dark:text-blue-400` |
| Sehr gut | `bg-slate-100 text-slate-700` | `dark:bg-slate-700 dark:text-slate-300` |
| Gut | `bg-slate-100 text-slate-600` | `dark:bg-slate-700 dark:text-slate-400` |
| Akzeptabel | `bg-slate-100 text-slate-600` | `dark:bg-slate-700 dark:text-slate-400` |

## Status Badges

| Status | Light Mode | Dark Mode |
|--------|------------|-----------|
| Aktiv | `bg-green-100 text-green-700` | `dark:bg-green-900/30 dark:text-green-400` |
| Verkauft | `bg-slate-100 text-slate-600` | `dark:bg-slate-700 dark:text-slate-400` |
| Pausiert | `bg-amber-100 text-amber-700` | `dark:bg-amber-900/30 dark:text-amber-400` |
| Abgelaufen | `bg-red-100 text-red-700` | `dark:bg-red-900/30 dark:text-red-400` |

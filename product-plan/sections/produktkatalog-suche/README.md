# Produktkatalog & Suche

Product catalog with filtering, sorting, and product cards.

## Components

| Component | Description |
|-----------|-------------|
| `ProductCatalog` | Main container with hero, filters, and product grid |
| `FilterSidebar` | Filter controls for search, category, price, location, etc. |
| `ProductCard` | Individual product display card |

## Files

- `types.ts` - TypeScript interfaces
- `data.json` - Sample data
- `tests.md` - Test specifications
- `components/` - Component implementations

## Callbacks

| Callback | Description |
|----------|-------------|
| `onApplyFilters` | Called when user applies filters |
| `onResetFilters` | Called when user resets filters |
| `onSortChange` | Called when sort option changes |
| `onViewProduct` | Called when user clicks a product card |
| `onToggleFavorite` | Called when user toggles favorite |
| `onEditProduct` | Called when owner clicks edit |
| `onDeleteProduct` | Called when owner clicks delete |

## Design Decisions

- **Mobile Filter**: Implemented as slide-out drawer instead of inline accordion
- **Product Grid**: Uses CSS Grid with responsive columns (3/2/1)
- **Price Display**: Overlaid on product image for quick scanning
- **Condition Badges**: Color-coded for quick identification
- **Relative Timestamps**: German format ("vor X Stunden/Tagen")

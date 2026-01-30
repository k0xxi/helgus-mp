import data from '@/../product/sections/produktkatalog-suche/data.json'
import { ProductCatalog } from './components/ProductCatalog'

export default function ProduktkataloView() {
  return (
    <ProductCatalog
      products={data.products}
      categories={data.categories}
      onViewProduct={(id) => console.log('View product:', id)}
      onToggleFavorite={(id) => console.log('Toggle favorite:', id)}
      onEditProduct={(id) => console.log('Edit product:', id)}
      onDeleteProduct={(id) => console.log('Delete product:', id)}
      onApplyFilters={(filters) => console.log('Apply filters:', filters)}
      onResetFilters={() => console.log('Reset filters')}
      onSortChange={(sortBy) => console.log('Sort by:', sortBy)}
    />
  )
}

import data from '@/../product/sections/verkaeufer-dashboard/data.json'
import { ListingsGrid } from './components/ListingsGrid'

export default function ListingsGridPreview() {
  return (
    <ListingsGrid
      products={data.products}
      onView={(id) => console.log('View listing:', id)}
      onEdit={(id) => console.log('Edit listing:', id)}
      onDelete={(id) => console.log('Delete listing:', id)}
      onTogglePause={(id) => console.log('Toggle pause:', id)}
      onMarkAsSold={(id) => console.log('Mark as sold:', id)}
      onCreate={() => console.log('Create new listing')}
    />
  )
}

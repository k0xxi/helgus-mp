import data from '@/../product/sections/verkaeufer-dashboard/data.json'
import { SellerDashboard } from './components/SellerDashboard'

export default function SellerDashboardPreview() {
  return (
    <SellerDashboard
      seller={data.seller}
      stats={data.stats}
      quickActions={data.quickActions}
      recentConversations={data.conversations}
      topProducts={data.products}
      onQuickAction={(action) => console.log('Quick action:', action)}
      onViewConversation={(id) => console.log('View conversation:', id)}
      onViewProduct={(id) => console.log('View product:', id)}
    />
  )
}

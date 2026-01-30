import data from '@/../product/sections/produktdetails-verhandlung/data.json'
import { ProductDetail } from './components/ProductDetail'

export default function ProductDetailPreview() {
  return (
    <ProductDetail
      product={data.product}
      seller={data.seller}
      category={data.category}
      messages={data.messages}
      offers={data.offers}
      notifications={data.notifications}
      currentUser={data.currentUser}
      onBack={() => console.log('Navigate back')}
      onCategoryClick={(slug) => console.log('Navigate to category:', slug)}
      onMakeOffer={(amount, message) => console.log('Make offer:', { amount, message })}
      onBuyRequest={() => console.log('Buy request sent')}
      onToggleFavorite={(id) => console.log('Toggle favorite:', id)}
      onShare={(id) => console.log('Share product:', id)}
      onSendMessage={(content) => console.log('Send message:', content)}
      onViewSellerProfile={(id) => console.log('View seller profile:', id)}
      onMarkNotificationRead={(id) => console.log('Mark notification read:', id)}
      onMarkAllNotificationsRead={() => console.log('Mark all notifications read')}
      onNotificationClick={(notification) => console.log('Notification clicked:', notification)}
      onAcceptOffer={(id) => console.log('Accept offer:', id)}
      onDeclineOffer={(id) => console.log('Decline offer:', id)}
    />
  )
}

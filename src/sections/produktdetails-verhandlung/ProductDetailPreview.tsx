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
      onBack={() => {}}
      onCategoryClick={() => {}}
      onMakeOffer={() => {}}
      onBuyRequest={() => {}}
      onToggleFavorite={() => {}}
      onShare={() => {}}
      onSendMessage={() => {}}
      onViewSellerProfile={() => {}}
      onMarkNotificationRead={() => {}}
      onMarkAllNotificationsRead={() => {}}
      onNotificationClick={() => {}}
      onAcceptOffer={() => {}}
      onDeclineOffer={() => {}}
    />
  )
}

import type {
  SellerDashboardProps,
  QuickAction,
  QuickActionType,
  DashboardStats,
  Seller,
  Conversation,
  SellerProduct
} from '../types'

// Extended props to include recent activity
interface SellerDashboardExtendedProps extends SellerDashboardProps {
  /** Recent conversations for activity feed */
  recentConversations?: Conversation[]
  /** Recent/top products for quick overview */
  topProducts?: SellerProduct[]
  /** Called when user clicks on a conversation */
  onViewConversation?: (conversationId: string) => void
  /** Called when user clicks on a product */
  onViewProduct?: (productId: string) => void
}

// Icon components
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}

function MessageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
    </svg>
  )
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
  )
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  )
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  )
}

function TagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
    </svg>
  )
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  )
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.403 12.652a3 3 0 0 0 0-5.304 3 3 0 0 0-3.75-3.751 3 3 0 0 0-5.305 0 3 3 0 0 0-3.751 3.75 3 3 0 0 0 0 5.305 3 3 0 0 0 3.75 3.751 3 3 0 0 0 5.305 0 3 3 0 0 0 3.751-3.75Zm-2.546-4.46a.75.75 0 0 0-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
      </svg>
      Verifiziert
    </span>
  )
}

// Quick Action Card component
function QuickActionCard({
  action,
  onClick
}: {
  action: QuickAction
  onClick?: () => void
}) {
  const iconMap = {
    plus: PlusIcon,
    message: MessageIcon,
    grid: GridIcon,
    settings: SettingsIcon
  }

  const Icon = iconMap[action.icon]
  const isPrimary = action.action === 'create-listing'

  return (
    <button
      onClick={onClick}
      className={`
        relative group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl
        transition-all duration-200 ease-out
        ${isPrimary
          ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 hover:scale-[1.02] dark:from-red-600 dark:to-red-700'
          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md'
        }
      `}
    >
      {action.badge && action.badge > 0 && (
        <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-bold text-white bg-red-500 rounded-full shadow-sm">
          {action.badge}
        </span>
      )}
      <Icon className={`w-7 h-7 ${isPrimary ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`} />
      <span className={`text-sm font-medium ${isPrimary ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>
        {action.label}
      </span>
    </button>
  )
}

// Stat Card component
function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  accentColor = 'slate'
}: {
  label: string
  value: number | string
  icon: React.ComponentType<{ className?: string }>
  trend?: 'up' | 'down' | 'neutral'
  accentColor?: 'red' | 'blue' | 'green' | 'slate'
}) {
  const colorClasses = {
    red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    slate: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{label}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[accentColor]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  )
}

// Recent Activity Item
function ActivityItem({
  conversation,
  onClick
}: {
  conversation: Conversation
  onClick?: () => void
}) {
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Gerade eben'
    if (diffInHours < 24) return `vor ${diffInHours}h`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return 'Gestern'
    return `vor ${diffInDays} Tagen`
  }

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left group"
    >
      <div className="relative flex-shrink-0">
        <img
          src={conversation.buyer.avatar}
          alt={conversation.buyer.name}
          className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-slate-800"
        />
        {conversation.unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full">
            {conversation.unreadCount}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-medium text-slate-900 dark:text-white truncate">
            {conversation.buyer.name}
          </span>
          {conversation.hasOffer && (
            <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
              {conversation.offerAmount}€ Angebot
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
          {conversation.productTitle}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300 truncate mt-1">
          {conversation.lastMessage}
        </p>
      </div>
      <div className="flex-shrink-0 flex flex-col items-end gap-2">
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {timeAgo(conversation.lastMessageAt)}
        </span>
        <ChevronRightIcon className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-500 transition-colors" />
      </div>
    </button>
  )
}

// Top Product Item
function TopProductItem({
  product,
  onClick
}: {
  product: SellerProduct
  onClick?: () => void
}) {
  const statusColors = {
    aktiv: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    verkauft: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
    pausiert: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    abgelaufen: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }

  const statusLabels = {
    aktiv: 'Aktiv',
    verkauft: 'Verkauft',
    pausiert: 'Pausiert',
    abgelaufen: 'Abgelaufen'
  }

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left group"
    >
      <img
        src={product.images[0]}
        alt={product.title}
        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-900 dark:text-white truncate mb-1">
          {product.title}
        </p>
        <div className="flex items-center gap-3 text-sm">
          <span className="font-semibold text-slate-900 dark:text-white">
            {product.price.toLocaleString('de-DE')}€
          </span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[product.status]}`}>
            {statusLabels[product.status]}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <EyeIcon className="w-3.5 h-3.5" />
            {product.views}
          </span>
          <span className="flex items-center gap-1">
            <MessageIcon className="w-3.5 h-3.5" />
            {product.inquiries}
          </span>
        </div>
      </div>
      <ChevronRightIcon className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-500 transition-colors flex-shrink-0" />
    </button>
  )
}

export function SellerDashboard({
  seller,
  stats,
  quickActions,
  recentConversations = [],
  topProducts = [],
  onQuickAction,
  onViewConversation,
  onViewProduct
}: SellerDashboardExtendedProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <img
              src={seller.avatar}
              alt={seller.name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-800 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Hallo, {seller.name.split(' ')[0]}!
                </h1>
                {seller.isVerified && <VerifiedBadge />}
              </div>
              <p className="text-slate-500 dark:text-slate-400">
                Willkommen in deinem Verkäufer-Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action) => (
            <QuickActionCard
              key={action.id}
              action={action}
              onClick={() => onQuickAction?.(action.action)}
            />
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Aktive Anzeigen"
            value={stats.activeListings}
            icon={GridIcon}
            accentColor="blue"
          />
          <StatCard
            label="Gesamtaufrufe"
            value={stats.totalViews.toLocaleString('de-DE')}
            icon={EyeIcon}
            accentColor="slate"
          />
          <StatCard
            label="Offene Nachrichten"
            value={stats.unreadMessages}
            icon={MessageIcon}
            accentColor={stats.unreadMessages > 0 ? 'red' : 'slate'}
          />
          <StatCard
            label="Verkauft (Monat)"
            value={stats.soldThisMonth}
            icon={CheckCircleIcon}
            accentColor="green"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Letzte Nachrichten
              </h2>
              {stats.unreadMessages > 0 && (
                <span className="px-2.5 py-1 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                  {stats.unreadMessages} neu
                </span>
              )}
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {recentConversations.length > 0 ? (
                recentConversations.slice(0, 4).map((conv) => (
                  <ActivityItem
                    key={conv.id}
                    conversation={conv}
                    onClick={() => onViewConversation?.(conv.id)}
                  />
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                  <MessageIcon className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                  <p>Noch keine Nachrichten</p>
                </div>
              )}
            </div>
            {recentConversations.length > 4 && (
              <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => onQuickAction?.('open-inbox')}
                  className="w-full py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  Alle Nachrichten anzeigen
                </button>
              </div>
            )}
          </div>

          {/* Top Products */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Deine Anzeigen
              </h2>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {stats.activeListings} aktiv
              </span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {topProducts.length > 0 ? (
                topProducts.slice(0, 4).map((product) => (
                  <TopProductItem
                    key={product.id}
                    product={product}
                    onClick={() => onViewProduct?.(product.id)}
                  />
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                  <TagIcon className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                  <p className="mb-4">Noch keine Anzeigen</p>
                  <button
                    onClick={() => onQuickAction?.('create-listing')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Erste Anzeige erstellen
                  </button>
                </div>
              )}
            </div>
            {topProducts.length > 4 && (
              <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => onQuickAction?.('view-listings')}
                  className="w-full py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  Alle Anzeigen anzeigen
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Pending Offers Banner */}
        {stats.pendingOffers > 0 && (
          <div className="mt-6 p-5 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl shadow-lg shadow-blue-500/25">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <TagIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">
                    {stats.pendingOffers} offene Preisangebot{stats.pendingOffers > 1 ? 'e' : ''}
                  </p>
                  <p className="text-blue-100 text-sm">
                    Käufer warten auf deine Antwort
                  </p>
                </div>
              </div>
              <button
                onClick={() => onQuickAction?.('open-inbox')}
                className="px-5 py-2.5 bg-white text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-colors"
              >
                Angebote ansehen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

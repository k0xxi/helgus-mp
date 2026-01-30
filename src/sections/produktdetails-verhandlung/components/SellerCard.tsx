import type { Seller } from '@/../product/sections/produktdetails-verhandlung/types'

interface SellerCardProps {
  seller: Seller
  onSendMessage?: () => void
  onViewProfile?: () => void
}

export function SellerCard({ seller, onSendMessage, onViewProfile }: SellerCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <button
          onClick={onViewProfile}
          className="flex-shrink-0 w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden hover:ring-2 hover:ring-red-500 hover:ring-offset-2 dark:hover:ring-offset-slate-800 transition-all"
        >
          {seller.avatar ? (
            <img src={seller.avatar} alt={seller.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <button
              onClick={onViewProfile}
              className="font-semibold text-slate-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors truncate"
            >
              {seller.name}
            </button>
            {seller.isVerified && (
              <span className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5 bg-blue-500 rounded-full" title="Verifizierter Verkäufer">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{seller.city}</span>
          </div>

          {/* Rating & Sales */}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{seller.rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {seller.totalSales} Verkäufe
            </span>
          </div>

          {/* Response Time */}
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            {seller.responseTime}
          </p>
        </div>
      </div>

      {/* Send Message Button */}
      <button
        onClick={onSendMessage}
        className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 dark:text-red-400 font-medium border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Nachricht senden
      </button>
    </div>
  )
}

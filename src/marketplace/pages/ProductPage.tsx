import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Package } from 'lucide-react'

export function ProductPage() {
  const { productId } = useParams()

  return (
    <div className="space-y-6">
      <Link
        to="/marketplace/search"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurück zur Suche
      </Link>

      {/* Placeholder content */}
      <div className="rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
        <Package className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
        <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">
          Produktdetails
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Produkt-ID: {productId || 'Nicht gefunden'}
        </p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Hier werden die Produktdetails, Bilder, Verkäuferinformationen und Kontaktoptionen angezeigt.
        </p>
      </div>
    </div>
  )
}

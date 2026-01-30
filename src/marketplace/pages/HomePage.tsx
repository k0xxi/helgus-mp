import { Link } from 'react-router-dom'
import { Search, TrendingUp, Tag, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Tables } from '@/types/database'

export function HomePage() {
  const [categories, setCategories] = useState<Tables<'categories'>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .is('parent_id', null)
        .order('sort_order')

      if (error) {
        console.error('Error fetching categories:', error)
      } else {
        setCategories(data || [])
      }
      setLoading(false)
    }

    fetchCategories()
  }, [])

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="rounded-2xl bg-gradient-to-br from-red-600 to-red-700 p-8 text-white md:p-12">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold md:text-4xl">
            Willkommen bei HELGUS Marktplatz
          </h1>
          <p className="mt-4 text-lg text-red-100">
            Kaufen und verkaufen Sie lokal. Sicher, einfach und nachhaltig.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/marketplace/search"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <Search className="h-5 w-5" />
              Jetzt stöbern
            </Link>
            <Link
              to="/marketplace/sell"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
            >
              Artikel verkaufen
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Kategorien
        </h2>
        {loading ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"
              />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/marketplace/search?category=${category.slug}`}
                className="group rounded-lg border border-slate-200 bg-white p-4 text-center transition-all hover:border-red-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-red-600"
              >
                <span className="text-sm font-medium text-slate-900 group-hover:text-red-600 dark:text-white dark:group-hover:text-red-400">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-slate-600 dark:text-slate-400">
            Kategorien werden geladen...
          </p>
        )}
      </section>

      {/* Features */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Lokal kaufen</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Finden Sie Angebote in Ihrer Nähe und sparen Sie Versandkosten.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-4 inline-flex rounded-lg bg-green-100 p-3 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <Tag className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Faire Preise</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Verhandeln Sie direkt mit dem Verkäufer und machen Sie Preisvorschläge.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-4 inline-flex rounded-lg bg-amber-100 p-3 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
            <Shield className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Sicher handeln</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Verifizierte Verkäufer und sichere Kommunikation über die Plattform.
          </p>
        </div>
      </section>
    </div>
  )
}

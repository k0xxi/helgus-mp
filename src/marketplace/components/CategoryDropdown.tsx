import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  productCount?: number
}

interface CategoryDropdownProps {
  categories: Category[]
  value: string | undefined
  onChange: (slug: string) => void
  placeholder?: string
}

export function CategoryDropdown({
  categories,
  value,
  onChange,
  placeholder = 'Alle Kategorien',
}: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedCategory = categories.find((cat) => cat.slug === value)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={containerRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent font-['Inter'] flex items-center justify-between"
      >
        <span>
          {selectedCategory ? selectedCategory.name : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
          {/* All Categories Option */}
          <button
            onClick={() => {
              onChange('')
              setIsOpen(false)
            }}
            className="w-full px-3 py-2.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 font-['Inter']"
          >
            {placeholder}
          </button>

          {/* Category Options */}
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                onChange(category.slug)
                setIsOpen(false)
              }}
              className="w-full px-3 py-2.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 font-['Inter'] flex items-center justify-between group"
            >
              <span>{category.name}</span>
              <span className="text-slate-500 dark:text-slate-400 text-sm">
                ({category.productCount || 0})
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

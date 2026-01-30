import { useState, useEffect } from 'react'
import type {
  ListingFormProps,
  ListingFormData,
  Category,
  ProductCondition
} from '../types'

// Icons
function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  )
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  )
}

function PhotoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}

function XMarkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  )
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  )
}

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  )
}

const STEPS = [
  { id: 1, title: 'Basis-Infos', description: 'Titel, Beschreibung & Preis' },
  { id: 2, title: 'Bilder', description: 'Produktfotos hochladen' },
  { id: 3, title: 'Standort', description: 'PLZ und Ort angeben' },
  { id: 4, title: 'Optionen', description: 'Zustand & Versand' }
]

const CONDITIONS: { value: ProductCondition; label: string; description: string }[] = [
  { value: 'neu', label: 'Neu', description: 'Originalverpackt, nie benutzt' },
  { value: 'wie-neu', label: 'Wie neu', description: 'Kaum benutzt, keine Gebrauchsspuren' },
  { value: 'sehr-gut', label: 'Sehr gut', description: 'Leichte Gebrauchsspuren' },
  { value: 'gut', label: 'Gut', description: 'Normale Gebrauchsspuren' },
  { value: 'akzeptabel', label: 'Akzeptabel', description: 'Deutliche Gebrauchsspuren' }
]

const COUNTRIES: { code: string; name: string; zipPattern: RegExp; zipPlaceholder: string; zipMaxLength: number }[] = [
  { code: 'DE', name: 'Deutschland', zipPattern: /^\d{5}$/, zipPlaceholder: 'z.B. 80331', zipMaxLength: 5 },
  { code: 'AT', name: 'Österreich', zipPattern: /^\d{4}$/, zipPlaceholder: 'z.B. 1010', zipMaxLength: 4 },
  { code: 'CH', name: 'Schweiz', zipPattern: /^\d{4}$/, zipPlaceholder: 'z.B. 8001', zipMaxLength: 4 },
  { code: 'LI', name: 'Liechtenstein', zipPattern: /^\d{4}$/, zipPlaceholder: 'z.B. 9490', zipMaxLength: 4 },
  { code: 'LU', name: 'Luxemburg', zipPattern: /^\d{4}$/, zipPlaceholder: 'z.B. 1234', zipMaxLength: 4 },
  { code: 'BE', name: 'Belgien', zipPattern: /^\d{4}$/, zipPlaceholder: 'z.B. 1000', zipMaxLength: 4 },
  { code: 'NL', name: 'Niederlande', zipPattern: /^\d{4}\s?[A-Z]{2}$/i, zipPlaceholder: 'z.B. 1011 AB', zipMaxLength: 7 },
  { code: 'FR', name: 'Frankreich', zipPattern: /^\d{5}$/, zipPlaceholder: 'z.B. 75001', zipMaxLength: 5 },
  { code: 'IT', name: 'Italien', zipPattern: /^\d{5}$/, zipPlaceholder: 'z.B. 00100', zipMaxLength: 5 },
  { code: 'PL', name: 'Polen', zipPattern: /^\d{2}-\d{3}$/, zipPlaceholder: 'z.B. 00-001', zipMaxLength: 6 },
  { code: 'CZ', name: 'Tschechien', zipPattern: /^\d{3}\s?\d{2}$/, zipPlaceholder: 'z.B. 110 00', zipMaxLength: 6 }
]

const defaultFormData: ListingFormData = {
  title: '',
  description: '',
  category: '',
  subcategory: '',
  price: 0,
  negotiable: false,
  images: [],
  location: { zip: '', city: '', country: 'AT' },
  condition: 'gut',
  shippingAvailable: false
}

export function ListingForm({
  categories,
  initialData,
  currentStep: initialStep = 1,
  onSubmit,
  onCancel,
  onNextStep,
  onPrevStep
}: ListingFormProps) {
  const [step, setStep] = useState(initialStep)
  const [formData, setFormData] = useState<ListingFormData>({
    ...defaultFormData,
    ...initialData
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ListingFormData, string>>>({})

  // Get subcategories for selected category
  const selectedCategory = categories.find(c => c.slug === formData.category)
  const subcategories = selectedCategory?.subcategories || []

  // Validation
  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Partial<Record<keyof ListingFormData, string>> = {}

    if (stepNumber === 1) {
      if (!formData.title.trim()) newErrors.title = 'Titel ist erforderlich'
      if (formData.title.length > 100) newErrors.title = 'Maximal 100 Zeichen'
      if (!formData.description.trim()) newErrors.description = 'Beschreibung ist erforderlich'
      if (!formData.category) newErrors.category = 'Kategorie ist erforderlich'
      if (!formData.subcategory) newErrors.subcategory = 'Unterkategorie ist erforderlich'
      if (formData.price <= 0) newErrors.price = 'Preis muss größer als 0 sein'
    }

    if (stepNumber === 2) {
      if (formData.images.length === 0) newErrors.images = 'Mindestens ein Bild ist erforderlich'
    }

    if (stepNumber === 3) {
      if (!formData.location.country) newErrors.location = 'Land ist erforderlich'
      if (!formData.location.zip.trim()) newErrors.location = 'PLZ ist erforderlich'
      else {
        const country = COUNTRIES.find(c => c.code === formData.location.country)
        if (country && !country.zipPattern.test(formData.location.zip.trim())) {
          newErrors.location = `Ungültige PLZ für ${country.name}`
        }
      }
      if (!formData.location.city.trim()) newErrors.location = 'Ort ist erforderlich'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      const nextStep = step + 1
      setStep(nextStep)
      onNextStep?.(nextStep, formData)
    }
  }

  const handlePrev = () => {
    const prevStep = step - 1
    setStep(prevStep)
    onPrevStep?.(prevStep)
  }

  const handleSubmit = () => {
    if (validateStep(step)) {
      onSubmit?.(formData)
    }
  }

  const updateFormData = (updates: Partial<ListingFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
    // Clear related errors
    const keys = Object.keys(updates) as (keyof ListingFormData)[]
    setErrors(prev => {
      const newErrors = { ...prev }
      keys.forEach(key => delete newErrors[key])
      return newErrors
    })
  }

  // Simulate adding an image (in real app, this would handle file upload)
  const handleAddImage = () => {
    const demoImages = [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop'
    ]
    const availableImages = demoImages.filter(img => !formData.images.includes(img))
    if (availableImages.length > 0) {
      updateFormData({ images: [...formData.images, availableImages[0]] })
    }
  }

  const handleRemoveImage = (index: number) => {
    updateFormData({ images: formData.images.filter((_, i) => i !== index) })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {initialData?.title ? 'Anzeige bearbeiten' : 'Neue Anzeige erstellen'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Schritt {step} von {STEPS.length}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((s, index) => (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step > s.id
                        ? 'bg-green-500 text-white'
                        : step === s.id
                        ? 'bg-red-500 text-white ring-4 ring-red-500/20'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {step > s.id ? <CheckIcon className="w-5 h-5" /> : s.id}
                  </div>
                  <span className={`mt-2 text-xs font-medium hidden sm:block ${
                    step >= s.id ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    {s.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`w-full h-1 mx-2 rounded ${
                    step > s.id ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'
                  }`} style={{ minWidth: '40px', maxWidth: '100px' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                    Basis-Informationen
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Beschreibe dein Produkt so genau wie möglich.
                  </p>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Titel *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateFormData({ title: e.target.value })}
                    placeholder="z.B. iPhone 14 Pro 256GB Space Black"
                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors ${
                      errors.title ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
                    }`}
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Beschreibung *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                    placeholder="Beschreibe den Zustand, besondere Merkmale und was im Lieferumfang enthalten ist..."
                    rows={4}
                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors resize-none ${
                      errors.description ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
                    }`}
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                </div>

                {/* Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Kategorie *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => updateFormData({ category: e.target.value, subcategory: '' })}
                      className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors ${
                        errors.category ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      <option value="">Kategorie wählen</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                    {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Unterkategorie *
                    </label>
                    <select
                      value={formData.subcategory}
                      onChange={(e) => updateFormData({ subcategory: e.target.value })}
                      disabled={!formData.category}
                      className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors disabled:opacity-50 ${
                        errors.subcategory ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      <option value="">Unterkategorie wählen</option>
                      {subcategories.map(sub => (
                        <option key={sub.id} value={sub.slug}>{sub.name}</option>
                      ))}
                    </select>
                    {errors.subcategory && <p className="mt-1 text-sm text-red-500">{errors.subcategory}</p>}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Preis *
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        value={formData.price || ''}
                        onChange={(e) => updateFormData({ price: parseFloat(e.target.value) || 0 })}
                        placeholder="0"
                        min="0"
                        step="0.01"
                        className={`w-full px-4 py-3 pr-12 bg-slate-50 dark:bg-slate-700 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors ${
                          errors.price ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
                        }`}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€</span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.negotiable}
                        onChange={(e) => updateFormData({ negotiable: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 text-red-500 focus:ring-red-500"
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-300">VB</span>
                    </label>
                  </div>
                  {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Images */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                    Produktbilder
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Füge mindestens ein Bild hinzu. Das erste Bild wird als Hauptbild verwendet.
                  </p>
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                      <img src={image} alt={`Bild ${index + 1}`} className="w-full h-full object-cover" />
                      {index === 0 && (
                        <span className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-lg">
                          Hauptbild
                        </span>
                      )}
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {formData.images.length < 6 && (
                    <button
                      onClick={handleAddImage}
                      className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-red-500 dark:hover:border-red-500 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <PhotoIcon className="w-8 h-8" />
                      <span className="text-sm font-medium">Bild hinzufügen</span>
                    </button>
                  )}
                </div>

                {errors.images && <p className="text-sm text-red-500">{errors.images}</p>}

                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Maximal 6 Bilder. Unterstützte Formate: JPG, PNG. Maximale Größe: 10MB pro Bild.
                </p>
              </div>
            )}

            {/* Step 3: Location */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                    Standort
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Wo kann das Produkt abgeholt werden?
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl flex items-start gap-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                    <MapPinIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1 space-y-4">
                    {/* Country Selection */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Land *
                      </label>
                      <select
                        value={formData.location.country || 'AT'}
                        onChange={(e) => updateFormData({
                          location: { ...formData.location, country: e.target.value, zip: '' }
                        })}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors"
                      >
                        {COUNTRIES.map(country => (
                          <option key={country.code} value={country.code}>{country.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          PLZ *
                        </label>
                        <input
                          type="text"
                          value={formData.location.zip}
                          onChange={(e) => updateFormData({
                            location: { ...formData.location, zip: e.target.value }
                          })}
                          placeholder={COUNTRIES.find(c => c.code === formData.location.country)?.zipPlaceholder || 'PLZ eingeben'}
                          maxLength={COUNTRIES.find(c => c.code === formData.location.country)?.zipMaxLength || 10}
                          className={`w-full px-4 py-3 bg-white dark:bg-slate-700 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors ${
                            errors.location ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Ort *
                        </label>
                        <input
                          type="text"
                          value={formData.location.city}
                          onChange={(e) => updateFormData({
                            location: { ...formData.location, city: e.target.value }
                          })}
                          placeholder="z.B. Wien"
                          className={`w-full px-4 py-3 bg-white dark:bg-slate-700 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors ${
                            errors.location ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
                          }`}
                        />
                      </div>
                    </div>
                    {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}

                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Die Koordinaten werden automatisch aus PLZ und Ort ermittelt (via OpenStreetMap).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Options */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                    Zusätzliche Optionen
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Gib den Zustand an und ob du Versand anbietest.
                  </p>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Zustand *
                  </label>
                  <div className="space-y-2">
                    {CONDITIONS.map(condition => (
                      <label
                        key={condition.value}
                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                          formData.condition === condition.value
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="condition"
                          value={condition.value}
                          checked={formData.condition === condition.value}
                          onChange={(e) => updateFormData({ condition: e.target.value as ProductCondition })}
                          className="w-5 h-5 text-red-500 focus:ring-red-500"
                        />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{condition.label}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{condition.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Shipping */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Versand
                  </label>
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      formData.shippingAvailable
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.shippingAvailable}
                      onChange={(e) => updateFormData({ shippingAvailable: e.target.checked })}
                      className="w-5 h-5 rounded text-blue-500 focus:ring-blue-500"
                    />
                    <div className="flex items-center gap-3">
                      <TruckIcon className="w-6 h-6 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Versand möglich</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Das Produkt kann auch versendet werden
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 sm:px-8 py-4 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <button
              onClick={step === 1 ? onCancel : handlePrev}
              className="flex items-center gap-2 px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              {step === 1 ? 'Abbrechen' : 'Zurück'}
            </button>

            {step < STEPS.length ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors"
              >
                Weiter
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors"
              >
                <CheckIcon className="w-4 h-4" />
                Anzeige veröffentlichen
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

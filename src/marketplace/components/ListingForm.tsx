import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  GripVertical,
  Trash2,
  ImagePlus,
  Loader2,
} from 'lucide-react'
import { useAuth } from '@/marketplace/context/AuthContext'
import { useCategories } from '@/marketplace/hooks/useProducts'
import { useListing, type ListingFormData, type ListingImage } from '@/marketplace/hooks'

const STEPS = [
  { id: 1, title: 'Basis-Infos', description: 'Titel, Beschreibung & Preis' },
  { id: 2, title: 'Bilder', description: 'Produktfotos hochladen' },
  { id: 3, title: 'Standort', description: 'Abholort angeben' },
  { id: 4, title: 'Optionen', description: 'Zustand & Versand' },
]

const CONDITIONS = [
  { value: 'neu', label: 'Neu', description: 'Originalverpackt, nie benutzt' },
  { value: 'wie-neu', label: 'Wie neu', description: 'Kaum benutzt, keine Gebrauchsspuren' },
  { value: 'sehr-gut', label: 'Sehr gut', description: 'Wenige Gebrauchsspuren' },
  { value: 'gut', label: 'Gut', description: 'Normale Gebrauchsspuren' },
  { value: 'akzeptabel', label: 'Akzeptabel', description: 'Deutliche Gebrauchsspuren' },
] as const

const COUNTRIES = [
  { value: 'AT', label: 'Österreich' },
  { value: 'DE', label: 'Deutschland' },
  { value: 'CH', label: 'Schweiz' },
]

interface FormErrors {
  title?: string
  description?: string
  categoryId?: string
  price?: string
  images?: string
  zip?: string
  city?: string
  condition?: string
  deliveryOptions?: string
}

export function ListingForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')

  const { user, profile } = useAuth()
  const { categories, loading: categoriesLoading } = useCategories()
  const { listing: existingListing, loading: listingLoading, createListing, updateListing } = useListing(editId || undefined)

  const [currentStep, setCurrentStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  // Form state
  const [formData, setFormData] = useState<ListingFormData>({
    title: '',
    description: '',
    categoryId: '',
    price: 0,
    negotiable: false,
    images: [],
    street: '',
    zip: profile?.zip || '',
    city: profile?.city || '',
    country: profile?.country || 'AT',
    condition: 'sehr-gut',
    deliveryOptions: ['abholung'],
    shippingCost: null,
    phoneContactAvailable: false,
  })

  // Load existing listing data for edit mode
  useEffect(() => {
    if (existingListing) {
      setFormData(existingListing)
    }
  }, [existingListing])

  // Update location from profile when loaded
  useEffect(() => {
    if (profile && !editId) {
      setFormData(prev => ({
        ...prev,
        zip: prev.zip || profile.zip || '',
        city: prev.city || profile.city || '',
        country: prev.country || profile.country || 'AT',
      }))
    }
  }, [profile, editId])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const updateForm = <K extends keyof ListingFormData>(key: K, value: ListingFormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }))
    // Clear error when field is updated
    if (errors[key as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [key]: undefined }))
    }
  }

  // Image handling
  const handleImageSelect = useCallback((files: FileList | null) => {
    if (!files) return

    const newImages: ListingImage[] = Array.from(files).map(file => ({
      id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview: URL.createObjectURL(file),
    }))

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 10), // Max 10 images
    }))
    setErrors(prev => ({ ...prev, images: undefined }))
  }, [])

  const handleImageDelete = useCallback((imageId: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId),
    }))
  }, [])

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newImages = [...formData.images]
    const draggedImage = newImages[draggedIndex]
    newImages.splice(draggedIndex, 1)
    newImages.splice(index, 0, draggedImage)

    setFormData(prev => ({ ...prev, images: newImages }))
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  // Validation
  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {}

    if (step === 1) {
      if (!formData.title.trim()) {
        newErrors.title = 'Titel ist erforderlich'
      } else if (formData.title.length < 5) {
        newErrors.title = 'Titel muss mindestens 5 Zeichen haben'
      }

      if (!formData.description.trim()) {
        newErrors.description = 'Beschreibung ist erforderlich'
      } else if (formData.description.length < 20) {
        newErrors.description = 'Beschreibung muss mindestens 20 Zeichen haben'
      }

      if (!formData.categoryId) {
        newErrors.categoryId = 'Kategorie ist erforderlich'
      }

      if (!formData.price || formData.price <= 0) {
        newErrors.price = 'Gültiger Preis ist erforderlich'
      }
    }

    if (step === 2) {
      if (formData.images.length === 0) {
        newErrors.images = 'Mindestens ein Bild ist erforderlich'
      }
    }

    if (step === 3) {
      if (!formData.zip.trim()) {
        newErrors.zip = 'PLZ ist erforderlich'
      }
      if (!formData.city.trim()) {
        newErrors.city = 'Stadt ist erforderlich'
      }
    }

    if (step === 4) {
      if (!formData.condition) {
        newErrors.condition = 'Zustand ist erforderlich'
      }
      if (formData.deliveryOptions.length === 0) {
        newErrors.deliveryOptions = 'Mindestens eine Versandoption ist erforderlich'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(4) || !user) return

    setSubmitting(true)

    try {
      if (editId) {
        const { error } = await updateListing(editId, formData, user.id)
        if (error) {
          console.error('Error updating listing:', error)
          setErrors({ title: 'Fehler beim Speichern. Bitte versuche es erneut.' })
          return
        }
      } else {
        const { id, error } = await createListing(formData, user.id)
        if (error || !id) {
          console.error('Error creating listing:', error)
          setErrors({ title: 'Fehler beim Erstellen. Bitte versuche es erneut.' })
          return
        }
      }

      navigate('/marketplace/my-listings')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate('/marketplace/my-listings')
  }

  if (categoriesLoading || (editId && listingLoading)) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {editId ? 'Anzeige bearbeiten' : 'Neue Anzeige erstellen'}
        </h1>
        <button
          onClick={handleCancel}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                  currentStep > step.id
                    ? 'border-green-500 bg-green-500 text-white'
                    : currentStep === step.id
                    ? 'border-red-600 bg-red-600 text-white'
                    : 'border-slate-300 bg-white text-slate-400 dark:border-slate-600 dark:bg-slate-800'
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="font-semibold">{step.id}</span>
                )}
              </div>
              <div className="mt-2 text-center hidden sm:block">
                <p className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{step.description}</p>
              </div>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 ${
                  currentStep > step.id ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Titel *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateForm('title', e.target.value)}
                placeholder="z.B. iPhone 14 Pro Max 256GB Space Black"
                className={`w-full rounded-lg border px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-white ${
                  errors.title
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-slate-200 focus:border-red-500 focus:ring-red-500/20 dark:border-slate-700'
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Beschreibung *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateForm('description', e.target.value)}
                placeholder="Beschreibe deinen Artikel detailliert..."
                rows={5}
                className={`w-full rounded-lg border px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-white ${
                  errors.description
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-slate-200 focus:border-red-500 focus:ring-red-500/20 dark:border-slate-700'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              )}
              <p className="mt-1 text-xs text-slate-500">{formData.description.length} / 2000 Zeichen</p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Kategorie *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => updateForm('categoryId', e.target.value)}
                className={`w-full rounded-lg border px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-white ${
                  errors.categoryId
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-slate-200 focus:border-red-500 focus:ring-red-500/20 dark:border-slate-700'
                }`}
              >
                <option value="">Kategorie wählen...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-500">{errors.categoryId}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Preis (€) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => updateForm('price', parseFloat(e.target.value) || 0)}
                    placeholder="0,00"
                    min="0"
                    step="0.01"
                    className={`w-full rounded-lg border px-4 py-2.5 pr-12 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-white ${
                      errors.price
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-slate-200 focus:border-red-500 focus:ring-red-500/20 dark:border-slate-700'
                    }`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">€</span>
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-500">{errors.price}</p>
                )}
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.negotiable}
                    onChange={(e) => updateForm('negotiable', e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-red-600 focus:ring-red-500 dark:border-slate-600"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Preis verhandelbar</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Images */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Produktbilder * <span className="text-slate-400 font-normal">(max. 10 Bilder)</span>
              </label>

              {/* Upload Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                  errors.images
                    ? 'border-red-400 bg-red-50 dark:border-red-800 dark:bg-red-900/10'
                    : 'border-slate-300 hover:border-red-400 hover:bg-red-50/50 dark:border-slate-600 dark:hover:border-red-600 dark:hover:bg-red-900/10'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageSelect(e.target.files)}
                  className="hidden"
                />
                <ImagePlus className="mx-auto h-12 w-12 text-slate-400" />
                <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Klicken zum Hochladen oder Drag & Drop
                </p>
                <p className="mt-1 text-xs text-slate-500">PNG, JPG bis 10MB</p>
              </div>
              {errors.images && (
                <p className="mt-1 text-sm text-red-500">{errors.images}</p>
              )}
            </div>

            {/* Image Preview Grid */}
            {formData.images.length > 0 && (
              <div>
                <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
                  Ziehe Bilder um die Reihenfolge zu ändern. Das erste Bild ist das Hauptbild.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div
                      key={image.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`group relative aspect-square rounded-lg overflow-hidden border-2 ${
                        index === 0
                          ? 'border-red-500'
                          : draggedIndex === index
                          ? 'border-red-400 opacity-50'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <img
                        src={image.preview}
                        alt={`Bild ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      {index === 0 && (
                        <span className="absolute top-2 left-2 rounded bg-red-600 px-1.5 py-0.5 text-xs font-medium text-white">
                          Hauptbild
                        </span>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="p-2 rounded-full bg-white/90 text-slate-700 hover:bg-white cursor-grab active:cursor-grabbing"
                          >
                            <GripVertical className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleImageDelete(image.id)}
                            className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Location */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Gib den Standort an, an dem der Artikel abgeholt werden kann.
            </p>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Land
              </label>
              <select
                value={formData.country}
                onChange={(e) => updateForm('country', e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                {COUNTRIES.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Straße und Hausnummer{' '}
                <span className="text-slate-400 font-normal">(optional, verbessert Genauigkeit)</span>
              </label>
              <input
                type="text"
                value={formData.street || ''}
                onChange={(e) => updateForm('street', e.target.value)}
                placeholder="z.B. Mariahilfer Straße 123"
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Die Straße wird nur für die Umkreissuche verwendet und wird Käufern nicht angezeigt.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  PLZ *
                </label>
                <input
                  type="text"
                  value={formData.zip}
                  onChange={(e) => updateForm('zip', e.target.value)}
                  placeholder={formData.country === 'AT' ? '1010' : formData.country === 'DE' ? '10115' : '8001'}
                  className={`w-full rounded-lg border px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-white ${
                    errors.zip
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-slate-200 focus:border-red-500 focus:ring-red-500/20 dark:border-slate-700'
                  }`}
                />
                {errors.zip && (
                  <p className="mt-1 text-sm text-red-500">{errors.zip}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Stadt *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateForm('city', e.target.value)}
                  placeholder="z.B. Wien"
                  className={`w-full rounded-lg border px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-white ${
                    errors.city
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-slate-200 focus:border-red-500 focus:ring-red-500/20 dark:border-slate-700'
                  }`}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Options & Summary */}
        {currentStep === 4 && (
          <div className="space-y-6">
            {/* Condition */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Zustand *
              </label>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {CONDITIONS.map((condition) => (
                  <label
                    key={condition.value}
                    className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                      formData.condition === condition.value
                        ? 'border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-900/20'
                        : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="condition"
                      value={condition.value}
                      checked={formData.condition === condition.value}
                      onChange={(e) => updateForm('condition', e.target.value as ListingFormData['condition'])}
                      className="hidden"
                    />
                    <p className="font-medium text-slate-900 dark:text-white">{condition.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{condition.description}</p>
                  </label>
                ))}
              </div>
              {errors.condition && (
                <p className="mt-1 text-sm text-red-500">{errors.condition}</p>
              )}
            </div>

            {/* Delivery Options */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Übergabeoptionen *
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 cursor-pointer hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600">
                  <input
                    type="checkbox"
                    checked={formData.deliveryOptions.includes('abholung')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateForm('deliveryOptions', [...formData.deliveryOptions, 'abholung'])
                      } else {
                        updateForm('deliveryOptions', formData.deliveryOptions.filter(o => o !== 'abholung'))
                      }
                    }}
                    className="h-5 w-5 rounded border-slate-300 text-red-600 focus:ring-red-500"
                  />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Abholung</p>
                    <p className="text-xs text-slate-500">Käufer holt den Artikel vor Ort ab</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 cursor-pointer hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600">
                  <input
                    type="checkbox"
                    checked={formData.deliveryOptions.includes('versand')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateForm('deliveryOptions', [...formData.deliveryOptions, 'versand'])
                      } else {
                        updateForm('deliveryOptions', formData.deliveryOptions.filter(o => o !== 'versand'))
                        updateForm('shippingCost', null)
                      }
                    }}
                    className="h-5 w-5 rounded border-slate-300 text-red-600 focus:ring-red-500"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">Versand</p>
                    <p className="text-xs text-slate-500">Artikel wird versendet</p>
                  </div>
                </label>

                {formData.deliveryOptions.includes('versand') && (
                  <div className="ml-8">
                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Versandkosten (€)
                    </label>
                    <input
                      type="number"
                      value={formData.shippingCost || ''}
                      onChange={(e) => updateForm('shippingCost', parseFloat(e.target.value) || null)}
                      placeholder="0,00"
                      min="0"
                      step="0.01"
                      className="w-32 rounded-lg border border-slate-200 px-4 py-2 text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                )}
              </div>
              {errors.deliveryOptions && (
                <p className="mt-1 text-sm text-red-500">{errors.deliveryOptions}</p>
              )}
            </div>

            {/* Phone Contact */}
            <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 cursor-pointer hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600">
              <input
                type="checkbox"
                checked={formData.phoneContactAvailable}
                onChange={(e) => updateForm('phoneContactAvailable', e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-red-600 focus:ring-red-500"
              />
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Telefonkontakt erlauben</p>
                <p className="text-xs text-slate-500">Interessenten können dich telefonisch erreichen</p>
              </div>
            </label>

            {/* Summary */}
            <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
              <h3 className="font-medium text-slate-900 dark:text-white mb-3">Zusammenfassung</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">Titel</dt>
                  <dd className="font-medium text-slate-900 dark:text-white">{formData.title || '—'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">Preis</dt>
                  <dd className="font-medium text-slate-900 dark:text-white">
                    {formData.price ? `${formData.price.toLocaleString('de-AT')} €` : '—'}
                    {formData.negotiable && ' (VB)'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">Bilder</dt>
                  <dd className="font-medium text-slate-900 dark:text-white">{formData.images.length} Bilder</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">Standort</dt>
                  <dd className="font-medium text-slate-900 dark:text-white">
                    {formData.zip && formData.city ? `${formData.zip} ${formData.city}` : '—'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">Zustand</dt>
                  <dd className="font-medium text-slate-900 dark:text-white">
                    {CONDITIONS.find(c => c.value === formData.condition)?.label || '—'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={currentStep === 1 ? handleCancel : handleBack}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          {currentStep === 1 ? 'Abbrechen' : 'Zurück'}
        </button>

        {currentStep < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
          >
            Weiter
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Wird gespeichert...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                {editId ? 'Änderungen speichern' : 'Anzeige veröffentlichen'}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

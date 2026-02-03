import { useState } from 'react'
import type { Address } from '@/../product/sections/nutzerverwaltung/types'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface AddressModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (address: Address) => void
  initialAddress?: Address
  countries: Array<{ code: string; name: string }>
  isEditing?: boolean
}

export function AddressModal({
  isOpen,
  onClose,
  onSave,
  initialAddress,
  countries,
  isEditing = false
}: AddressModalProps) {
  const [address, setAddress] = useState<Address>(
    initialAddress || {
      street: '',
      houseNumber: '',
      zip: '',
      city: '',
      country: 'AT'
    }
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!address.street.trim()) newErrors.street = 'Straße ist erforderlich'
    if (!address.houseNumber.trim()) newErrors.houseNumber = 'Hausnummer ist erforderlich'
    if (!address.zip.trim()) newErrors.zip = 'PLZ ist erforderlich'
    if (!address.city.trim()) newErrors.city = 'Ort ist erforderlich'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('AddressModal: handleSubmit called with address:', address)

    if (!validateForm()) {
      console.log('AddressModal: Validation failed')
      return
    }

    setIsSubmitting(true)
    console.log('AddressModal: About to call onSave with:', address)
    // Simulate save delay
    setTimeout(() => {
      console.log('AddressModal: Calling onSave callback')
      onSave(address)
      setIsSubmitting(false)
      onClose()
    }, 500)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {isEditing ? 'Adresse bearbeiten' : 'Adresse hinzufügen'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Street */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Straße
            </label>
            <input
              type="text"
              value={address.street}
              onChange={(e) => {
                setAddress({ ...address, street: e.target.value })
                if (errors.street) setErrors({ ...errors, street: '' })
              }}
              placeholder="z.B. Hauptstraße"
              className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors ${
                errors.street
                  ? 'border-red-500'
                  : 'border-slate-200 dark:border-slate-600'
              }`}
            />
            {errors.street && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.street}</p>
            )}
          </div>

          {/* House Number */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Hausnummer
            </label>
            <input
              type="text"
              value={address.houseNumber}
              onChange={(e) => {
                setAddress({ ...address, houseNumber: e.target.value })
                if (errors.houseNumber) setErrors({ ...errors, houseNumber: '' })
              }}
              placeholder="z.B. 42"
              className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors ${
                errors.houseNumber
                  ? 'border-red-500'
                  : 'border-slate-200 dark:border-slate-600'
              }`}
            />
            {errors.houseNumber && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.houseNumber}</p>
            )}
          </div>

          {/* ZIP and City Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                PLZ
              </label>
              <input
                type="text"
                value={address.zip}
                onChange={(e) => {
                  setAddress({ ...address, zip: e.target.value })
                  if (errors.zip) setErrors({ ...errors, zip: '' })
                }}
                placeholder="9020"
                className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors ${
                  errors.zip ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
                }`}
              />
              {errors.zip && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.zip}</p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Ort
              </label>
              <input
                type="text"
                value={address.city}
                onChange={(e) => {
                  setAddress({ ...address, city: e.target.value })
                  if (errors.city) setErrors({ ...errors, city: '' })
                }}
                placeholder="z.B. Villach"
                className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors ${
                  errors.city ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
                }`}
              />
              {errors.city && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.city}</p>
              )}
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Land
            </label>
            <select
              value={address.country}
              onChange={(e) => setAddress({ ...address, country: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Speichern...' : 'Speichern'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

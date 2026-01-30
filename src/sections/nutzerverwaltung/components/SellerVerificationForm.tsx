import { useState, useMemo } from 'react'
import type {
  SellerVerificationFormProps,
  SellerVerification,
  Address,
  BankAccount,
  VerificationStep
} from '@/../product/sections/nutzerverwaltung/types'
import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  MapPinIcon,
  DocumentCheckIcon,
  CheckIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ExclamationCircleIcon,
  BanknotesIcon,
  TruckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const STEPS = [
  { id: 1 as VerificationStep, label: 'Übersicht', icon: SparklesIcon },
  { id: 2 as VerificationStep, label: 'Adresse', icon: MapPinIcon },
  { id: 3 as VerificationStep, label: 'Bankdaten', icon: CreditCardIcon },
  { id: 4 as VerificationStep, label: 'Bestätigung', icon: DocumentCheckIcon },
]

export function SellerVerificationForm({
  currentStep: initialStep = 1,
  initialData,
  countries,
  onComplete,
  onCancel,
  onNextStep,
  onPrevStep
}: SellerVerificationFormProps) {
  const [step, setStep] = useState<VerificationStep>(initialStep)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Form data
  const [fullName, setFullName] = useState(initialData?.fullName || '')
  const [address, setAddress] = useState<Address>(initialData?.address || {
    street: '',
    houseNumber: '',
    zip: '',
    city: '',
    country: 'AT'
  })
  const [bankAccount, setBankAccount] = useState<BankAccount>(initialData?.bankAccount || {
    accountHolder: '',
    iban: '',
    bic: ''
  })

  // IBAN formatting
  const formatIBAN = (value: string) => {
    const cleaned = value.replace(/\s/g, '').toUpperCase()
    const groups = cleaned.match(/.{1,4}/g) || []
    return groups.join(' ')
  }

  const validateIBAN = (iban: string): boolean => {
    const cleaned = iban.replace(/\s/g, '')
    // Basic length validation for common countries
    if (cleaned.startsWith('AT') && cleaned.length !== 20) return false
    if (cleaned.startsWith('DE') && cleaned.length !== 22) return false
    if (cleaned.startsWith('CH') && cleaned.length !== 21) return false
    return /^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(cleaned)
  }

  const validateStep = (stepNum: VerificationStep): boolean => {
    const newErrors: Record<string, string> = {}

    if (stepNum === 2) {
      if (!fullName.trim()) newErrors.fullName = 'Name ist erforderlich'
      if (!address.street.trim()) newErrors.street = 'Straße ist erforderlich'
      if (!address.houseNumber.trim()) newErrors.houseNumber = 'Hausnummer ist erforderlich'
      if (!address.zip.trim()) newErrors.zip = 'PLZ ist erforderlich'
      if (!address.city.trim()) newErrors.city = 'Ort ist erforderlich'
    }

    if (stepNum === 3) {
      if (!bankAccount.accountHolder.trim()) newErrors.accountHolder = 'Kontoinhaber ist erforderlich'
      if (!bankAccount.iban.trim()) {
        newErrors.iban = 'IBAN ist erforderlich'
      } else if (!validateIBAN(bankAccount.iban)) {
        newErrors.iban = 'Ungültige IBAN'
      }
    }

    if (stepNum === 4) {
      if (!acceptedTerms) newErrors.terms = 'Du musst die AGB akzeptieren'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (!validateStep(step)) return

    const nextStep = (step + 1) as VerificationStep
    const partialData: Partial<SellerVerification> = {
      fullName,
      address,
      bankAccount,
      acceptedTerms
    }

    onNextStep?.(nextStep, partialData)
    setStep(nextStep)
  }

  const handlePrev = () => {
    const prevStep = (step - 1) as VerificationStep
    onPrevStep?.(prevStep)
    setStep(prevStep)
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) return

    setIsSubmitting(true)

    const data: SellerVerification = {
      fullName,
      address,
      bankAccount: {
        ...bankAccount,
        iban: bankAccount.iban.replace(/\s/g, '')
      },
      acceptedTerms
    }

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      onComplete?.(data)
    }, 1500)
  }

  const selectedCountry = useMemo(() =>
    countries.find(c => c.code === address.country),
    [countries, address.country]
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/25 mb-6">
          <CheckBadgeIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Verkäufer-Verifizierung
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Werde verifizierter Verkäufer und schalte alle Vorteile frei
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
          </div>

          {/* Step Indicators */}
          {STEPS.map((s) => (
            <div key={s.id} className="relative flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  step > s.id
                    ? 'bg-blue-500 text-white'
                    : step === s.id
                    ? 'bg-blue-500 text-white ring-4 ring-blue-500/20'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                }`}
              >
                {step > s.id ? (
                  <CheckIcon className="w-5 h-5" />
                ) : (
                  <s.icon className="w-5 h-5" />
                )}
              </div>
              <span className={`mt-2 text-xs font-medium ${
                step >= s.id ? 'text-slate-900 dark:text-white' : 'text-slate-400'
              }`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
        {/* Step 1: Overview */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Vorteile der Verifizierung
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Als verifizierter Verkäufer erhältst du besondere Vorteile
              </p>
            </div>

            <div className="grid gap-4">
              <BenefitCard
                icon={ShieldCheckIcon}
                title="Vertrauens-Badge"
                description="Dein Profil wird mit einem blauen Häkchen markiert - Käufer vertrauen dir mehr."
              />
              <BenefitCard
                icon={BanknotesIcon}
                title="Vorauskasse-Option"
                description="Biete Käufern die Möglichkeit, vorab zu bezahlen. Sichere Zahlungen direkt auf dein Konto."
              />
              <BenefitCard
                icon={TruckIcon}
                title="Versand-Priorisierung"
                description="Deine Anzeigen werden in den Suchergebnissen höher gerankt."
              />
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                Was wird benötigt?
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4" /> Vollständige Adresse
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4" /> Bankverbindung (IBAN)
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 2: Address */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Adressdaten
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Gib deine vollständige Adresse ein (wie auf deinem Ausweis)
              </p>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Vollständiger Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Max Mustermann"
                  className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors ${
                    errors.fullName ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
                  }`}
                />
                {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
              </div>

              {/* Street & House Number */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Straße *
                  </label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    placeholder="Musterstraße"
                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors ${
                      errors.street ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
                    }`}
                  />
                  {errors.street && <p className="mt-1 text-sm text-red-500">{errors.street}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Nr. *
                  </label>
                  <input
                    type="text"
                    value={address.houseNumber}
                    onChange={(e) => setAddress({ ...address, houseNumber: e.target.value })}
                    placeholder="12a"
                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors ${
                      errors.houseNumber ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
                    }`}
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Land *
                </label>
                <select
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value, zip: '' })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                >
                  {countries.map(c => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* ZIP & City */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    PLZ *
                  </label>
                  <input
                    type="text"
                    value={address.zip}
                    onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                    placeholder={address.country === 'AT' ? '1010' : '80331'}
                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors ${
                      errors.zip ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
                    }`}
                  />
                  {errors.zip && <p className="mt-1 text-sm text-red-500">{errors.zip}</p>}
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Ort *
                  </label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="Wien"
                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors ${
                      errors.city ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
                    }`}
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Bank Account */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Bankverbindung
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Diese Daten werden nur für Vorauskasse-Zahlungen verwendet
              </p>
            </div>

            <div className="space-y-4">
              {/* Account Holder */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Kontoinhaber *
                </label>
                <input
                  type="text"
                  value={bankAccount.accountHolder}
                  onChange={(e) => setBankAccount({ ...bankAccount, accountHolder: e.target.value })}
                  placeholder="Max Mustermann"
                  className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors ${
                    errors.accountHolder ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
                  }`}
                />
                {errors.accountHolder && <p className="mt-1 text-sm text-red-500">{errors.accountHolder}</p>}
              </div>

              {/* IBAN */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  IBAN *
                </label>
                <input
                  type="text"
                  value={bankAccount.iban}
                  onChange={(e) => setBankAccount({
                    ...bankAccount,
                    iban: formatIBAN(e.target.value.slice(0, 34))
                  })}
                  placeholder="AT89 3704 0044 0532 0130 00"
                  className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-mono ${
                    errors.iban ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
                  }`}
                />
                {errors.iban && <p className="mt-1 text-sm text-red-500">{errors.iban}</p>}
              </div>

              {/* BIC */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  BIC (optional)
                </label>
                <input
                  type="text"
                  value={bankAccount.bic || ''}
                  onChange={(e) => setBankAccount({ ...bankAccount, bic: e.target.value.toUpperCase() })}
                  placeholder="RLNWATWW"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-mono"
                />
                <p className="mt-1 text-xs text-slate-400">
                  Wird automatisch ermittelt, wenn nicht angegeben
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl">
              <div className="flex items-start gap-3">
                <ShieldCheckIcon className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Deine Bankdaten werden verschlüsselt gespeichert und nur für die Abwicklung von Vorauskasse-Zahlungen verwendet.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Zusammenfassung
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Überprüfe deine Angaben vor dem Abschluss
              </p>
            </div>

            {/* Summary Cards */}
            <div className="space-y-4">
              <SummaryCard
                icon={MapPinIcon}
                title="Adresse"
                content={
                  <>
                    <p className="font-medium">{fullName}</p>
                    <p>{address.street} {address.houseNumber}</p>
                    <p>{address.zip} {address.city}</p>
                    <p>{selectedCountry?.name}</p>
                  </>
                }
              />

              <SummaryCard
                icon={CreditCardIcon}
                title="Bankverbindung"
                content={
                  <>
                    <p className="font-medium">{bankAccount.accountHolder}</p>
                    <p className="font-mono">{bankAccount.iban}</p>
                    {bankAccount.bic && <p className="font-mono text-sm">{bankAccount.bic}</p>}
                  </>
                }
              />
            </div>

            {/* Terms Checkbox */}
            <label className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-colors ${
              errors.terms
                ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                : 'bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}>
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => {
                  setAcceptedTerms(e.target.checked)
                  if (e.target.checked) {
                    setErrors(prev => ({ ...prev, terms: '' }))
                  }
                }}
                className="mt-1 w-5 h-5 text-blue-600 bg-slate-100 dark:bg-slate-600 border-slate-300 dark:border-slate-500 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Ich akzeptiere die{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                  AGB für Verkäufer
                </a>
                {' '}und bestätige, dass alle Angaben korrekt sind.
              </span>
            </label>
            {errors.terms && (
              <p className="flex items-center gap-1 text-sm text-red-500">
                <ExclamationCircleIcon className="w-4 h-4" />
                {errors.terms}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <div>
          {step === 1 ? (
            <button
              onClick={onCancel}
              className="px-6 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors"
            >
              Abbrechen
            </button>
          ) : (
            <button
              onClick={handlePrev}
              className="flex items-center gap-2 px-6 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Zurück
            </button>
          )}
        </div>

        <div>
          {step < 4 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all"
            >
              Weiter
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Wird verifiziert...
                </>
              ) : (
                <>
                  <CheckBadgeIcon className="w-5 h-5" />
                  Verifizierung abschließen
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper Components

interface BenefitCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

function BenefitCard({ icon: Icon, title, description }: BenefitCardProps) {
  return (
    <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      </div>
      <div>
        <h3 className="font-medium text-slate-900 dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </div>
  )
}

interface SummaryCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  content: React.ReactNode
}

function SummaryCard({ icon: Icon, title, content }: SummaryCardProps) {
  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</h4>
          <div className="text-slate-900 dark:text-white text-sm">
            {content}
          </div>
        </div>
      </div>
    </div>
  )
}

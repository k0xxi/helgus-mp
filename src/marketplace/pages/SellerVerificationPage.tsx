import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useSellerVerification } from '@/hooks'
import { SellerVerificationForm } from '@/sections/nutzerverwaltung/components'
import type { SellerVerification, Country, VerificationStep } from '@/../product/sections/nutzerverwaltung/types'
import { CheckBadgeIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline'

// Default countries for the form
const COUNTRIES: Country[] = [
  { code: 'AT', name: 'Österreich' },
  { code: 'DE', name: 'Deutschland' },
  { code: 'CH', name: 'Schweiz' },
]

export function SellerVerificationPage() {
  const navigate = useNavigate()
  const { user, profile, loading: authLoading, refreshProfile } = useAuth()
  const { verification, loading: verificationLoading, submitVerification } = useSellerVerification(user?.id)
  const [currentStep, setCurrentStep] = useState<VerificationStep>(1)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth')
    }
  }, [user, authLoading, navigate])

  const loading = authLoading || verificationLoading

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  // If already verified, show success state
  if (profile?.isVerified) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-2xl mb-6">
          <CheckBadgeIcon className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Du bist verifiziert!
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Dein Verkäuferstatus wurde bestätigt. Du kannst jetzt alle Vorteile nutzen.
        </p>
        <button
          onClick={() => navigate('/profile')}
          className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium rounded-xl transition-colors"
        >
          Zurück zum Profil
        </button>
      </div>
    )
  }

  // If verification is pending, show status
  if (verification?.status === 'pending') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl mb-6">
          <ClockIcon className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Verifizierung in Prüfung
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Deine Daten werden überprüft. Du erhältst eine Benachrichtigung, sobald die Prüfung abgeschlossen ist.
        </p>
        <button
          onClick={() => navigate('/profile')}
          className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium rounded-xl transition-colors"
        >
          Zurück zum Profil
        </button>
      </div>
    )
  }

  // If verification was rejected, show status with option to retry
  if (verification?.status === 'rejected') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-2xl mb-6">
          <XCircleIcon className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Verifizierung abgelehnt
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Leider konnten deine Daten nicht verifiziert werden. Bitte überprüfe deine Angaben und versuche es erneut.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors"
        >
          Erneut versuchen
        </button>
      </div>
    )
  }

  // Show verification form
  const handleComplete = async (data: SellerVerification) => {
    const { error } = await submitVerification({
      fullName: data.fullName,
      street: data.address.street,
      houseNumber: data.address.houseNumber,
      zip: data.address.zip,
      city: data.address.city,
      country: data.address.country,
      iban: data.bankAccount.iban,
      bic: data.bankAccount.bic,
      acceptedTerms: data.acceptedTerms,
    })

    if (error) {
      console.error('Verification error:', error)
      // The form will show the error
    } else {
      // Refresh profile to get updated verification status
      await refreshProfile()
    }
  }

  const handleCancel = () => {
    navigate('/profile')
  }

  const handleNextStep = (step: VerificationStep) => {
    setCurrentStep(step)
  }

  const handlePrevStep = (step: VerificationStep) => {
    setCurrentStep(step)
  }

  // Pre-fill with profile data if available
  const initialData = profile ? {
    fullName: profile.name,
    address: {
      street: '',
      houseNumber: '',
      zip: profile.zip ?? '',
      city: profile.city ?? '',
      country: profile.country,
    },
  } : undefined

  return (
    <SellerVerificationForm
      currentStep={currentStep}
      initialData={initialData}
      countries={COUNTRIES}
      onComplete={handleComplete}
      onCancel={handleCancel}
      onNextStep={handleNextStep}
      onPrevStep={handlePrevStep}
    />
  )
}

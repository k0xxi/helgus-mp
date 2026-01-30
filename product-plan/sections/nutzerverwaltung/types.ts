// =============================================================================
// Data Types
// =============================================================================

export interface Address {
  street: string
  houseNumber: string
  zip: string
  city: string
  country: string // ISO 3166-1 alpha-2 (AT, DE, CH, etc.)
}

export interface BankAccount {
  accountHolder: string
  iban: string
  bic?: string
}

export interface NotificationSettings {
  emailMessages: boolean
  emailOffers: boolean
  emailListingUpdates: boolean
  pushEnabled: boolean
  newsletter: boolean
}

export interface SellerVerification {
  fullName: string
  address: Address
  bankAccount: BankAccount
  acceptedTerms: boolean
  verifiedAt?: string
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  bio?: string
  phone?: string
  address?: Address
  memberSince: string
  isVerified: boolean
  verificationDate?: string
  notificationSettings: NotificationSettings
  sellerVerification?: SellerVerification
}

export type SocialProvider = 'google' | 'apple'

export interface ConnectedAccount {
  id: string
  provider: SocialProvider
  email: string
  connectedAt: string
}

export interface PublicProfile {
  id: string
  name: string
  avatar?: string
  bio?: string
  city: string
  country: string
  memberSince: string
  isVerified: boolean
  listingsCount: number
  responseTime: string | null
}

export type ProductCondition = 'neu' | 'wie-neu' | 'sehr-gut' | 'gut' | 'akzeptabel'

export interface UserListing {
  id: string
  title: string
  price: number
  image: string
  location: {
    city: string
    country: string
  }
  condition: ProductCondition
  createdAt: string
}

export interface Country {
  code: string
  name: string
}

export type PasswordStrength = 'schwach' | 'mittel' | 'stark'

export interface RegistrationData {
  name: string
  email: string
  password: string
  acceptedTerms: boolean
  acceptedPrivacy: boolean
}

export type VerificationStep = 1 | 2 | 3 | 4
export type VerificationStatus = 'not_started' | 'in_progress' | 'pending' | 'verified' | 'rejected'

// =============================================================================
// Component Props
// =============================================================================

export interface LoginFormProps {
  /** Called when user submits login form */
  onLogin?: (email: string, password: string, rememberMe: boolean) => void
  /** Called when user clicks social login button */
  onSocialLogin?: (provider: SocialProvider) => void
  /** Called when user clicks "Forgot password" link */
  onForgotPassword?: () => void
  /** Called when user clicks "Register" link */
  onRegister?: () => void
  /** Error message to display */
  error?: string
  /** Loading state */
  isLoading?: boolean
}

export interface RegistrationFormProps {
  /** Called when user submits registration form */
  onRegister?: (data: RegistrationData) => void
  /** Called when user clicks social login button */
  onSocialLogin?: (provider: SocialProvider) => void
  /** Called when user clicks "Login" link */
  onLogin?: () => void
  /** Error message to display */
  error?: string
  /** Loading state */
  isLoading?: boolean
}

export interface ProfileSettingsProps {
  /** Current user data */
  user: User
  /** Connected social accounts */
  connectedAccounts: ConnectedAccount[]
  /** Available countries for address */
  countries: Country[]

  /** Called when user saves profile changes */
  onSaveProfile?: (data: Partial<User>) => void
  /** Called when user changes password */
  onChangePassword?: () => void
  /** Called when user wants to start verification */
  onStartVerification?: () => void
  /** Called when user connects a social account */
  onConnectAccount?: (provider: SocialProvider) => void
  /** Called when user disconnects a social account */
  onDisconnectAccount?: (accountId: string) => void
  /** Called when user wants to delete account */
  onDeleteAccount?: () => void
}

export interface PasswordResetProps {
  /** Called when user requests password reset email */
  onRequestReset?: (email: string) => void
  /** Called when user submits new password */
  onResetPassword?: (password: string) => void
  /** Called when user clicks "Back to login" */
  onBackToLogin?: () => void
  /** Current mode */
  mode: 'request' | 'reset'
  /** Error message */
  error?: string
  /** Success message */
  success?: string
  /** Loading state */
  isLoading?: boolean
}

export interface ChangePasswordProps {
  /** Called when user submits password change */
  onChangePassword?: (currentPassword: string, newPassword: string) => void
  /** Called when user cancels */
  onCancel?: () => void
  /** Error message */
  error?: string
  /** Loading state */
  isLoading?: boolean
}

export interface SellerVerificationFormProps {
  /** Current step (1-4) */
  currentStep?: VerificationStep
  /** Initial data (for resuming) */
  initialData?: Partial<SellerVerification>
  /** Available countries */
  countries: Country[]

  /** Called when verification is completed */
  onComplete?: (data: SellerVerification) => void
  /** Called when user cancels */
  onCancel?: () => void
  /** Called when user moves to next step */
  onNextStep?: (step: VerificationStep, data: Partial<SellerVerification>) => void
  /** Called when user moves to previous step */
  onPrevStep?: (step: VerificationStep) => void
}

export interface PublicProfileProps {
  /** The user's public profile */
  profile: PublicProfile
  /** User's active listings */
  listings: UserListing[]

  /** Called when user clicks "Send message" */
  onSendMessage?: (userId: string) => void
  /** Called when user clicks on a listing */
  onViewListing?: (listingId: string) => void
  /** Called when user clicks "View all listings" */
  onViewAllListings?: (userId: string) => void
}

# Milestone 06: Nutzerverwaltung

Build user registration, authentication, profile management, and seller verification.

## Overview

This section handles all user-related functionality: login, registration, profile settings, password management, and the seller verification upgrade flow.

## Components to Build

### 1. AuthPage

Combined login/registration page with tabs.

**File**: `components/sections/nutzerverwaltung/AuthPage.tsx`

**Features**:
- Tab switcher (Anmelden / Registrieren)
- Contains LoginForm or RegistrationForm based on active tab
- Decorative background gradients
- Logo header
- Footer with legal links

### 2. LoginForm

Login form component.

**File**: `components/sections/nutzerverwaltung/LoginForm.tsx`

**Fields**:
- Email input
- Password input (with show/hide toggle)
- "Angemeldet bleiben" checkbox
- Login button
- Social login buttons (Google, Apple)
- "Passwort vergessen?" link
- Link to registration

**Validation**:
- Email format validation
- Required field checks

### 3. RegistrationForm

Registration form component.

**File**: `components/sections/nutzerverwaltung/RegistrationForm.tsx`

**Fields**:
- Name input
- Email input
- Password input (with strength indicator)
- Password confirmation
- Terms checkbox with link
- Privacy checkbox with link
- Register button
- Social login buttons
- Link to login

**Validation**:
- Email format
- Password: min 8 chars, 1 number, 1 special character
- Password confirmation match
- All checkboxes required

### 4. ProfileSettings

Profile management page with tabs.

**File**: `components/sections/nutzerverwaltung/ProfileSettings.tsx`

**Tabs**:
1. **Persönliche Daten**: Avatar upload, name, bio, email, phone
2. **Adresse & Standort**: Street, ZIP, city, country
3. **Benachrichtigungen**: Toggle switches for email/push preferences
4. **Sicherheit**: Change password link, connected accounts, delete account

### 5. PasswordReset

Password reset request/form page.

**File**: `components/sections/nutzerverwaltung/PasswordReset.tsx`

**Modes**:
- **Request**: Email input + "Link senden" button
- **Reset**: New password + confirmation (from email link)

**Features**:
- Success/error messages
- Back to login link
- Password strength indicator

### 6. ChangePassword

In-app password change form.

**File**: `components/sections/nutzerverwaltung/ChangePassword.tsx`

**Fields**:
- Current password
- New password (with strength indicator)
- Confirm new password

### 7. SellerVerificationForm

Multi-step seller verification flow.

**File**: `components/sections/nutzerverwaltung/SellerVerificationForm.tsx`

**Steps**:
1. **Übersicht**: Benefits explanation, requirements, start button
2. **Adressdaten**: Full name, street, house number, ZIP, city, country
3. **Bankdaten**: Account holder, IBAN (with formatting), BIC
4. **Bestätigung**: Summary, terms checkbox, complete button

**Features**:
- Step indicator
- Back/Next navigation
- Form validation per step
- IBAN formatting and validation
- Final success confirmation screen

### 8. PublicProfile

Public-facing user profile page.

**File**: `components/sections/nutzerverwaltung/PublicProfile.tsx`

**Elements**:
- Large avatar
- Display name
- Verified badge (if applicable)
- Member since date
- Bio/description
- City (no exact address)
- "Nachricht senden" button
- Grid of active listings (max 6)
- "Alle Anzeigen anzeigen" link

## User Flows

1. **Login**: Enter credentials → Authenticate → Redirect to dashboard
2. **Register**: Fill form → Create account → Email verification → Login
3. **Forgot Password**: Enter email → Receive link → Reset password
4. **Edit Profile**: Update info → Save → See confirmation
5. **Change Password**: Enter current + new → Update → Confirmation
6. **Become Verified Seller**: Complete 4-step verification → Get badge
7. **View Public Profile**: See user's public info and listings

## UI Specifications

### Auth Page
- Background: Gradient with subtle decorative blobs
- Card: White/dark, rounded-3xl, shadow
- Tab switcher: Pill-style toggle
- Social buttons: Icon + text, border style

### Form Inputs
- Label above input
- Focus ring in primary color
- Error message below in red
- Helper text in muted color

### Password Strength Indicator
- Bar that fills based on strength
- Colors: red (weak), yellow (medium), green (strong)
- Text label: "schwach" / "mittel" / "stark"

### Verification Steps
- Progress indicator with numbered circles
- Completed steps: Checkmark, green
- Active step: Primary color
- Inactive: Gray outline

### IBAN Input
- Auto-format with spaces every 4 characters
- Validate format based on country
- Show bank name when valid (optional)

## Data Types

```typescript
interface User {
  id: string
  email: string
  name: string
  avatar?: string
  bio?: string
  phone?: string
  address?: Address
  memberSince: string
  isVerified: boolean
  notificationSettings: NotificationSettings
}

interface Address {
  street: string
  houseNumber: string
  zip: string
  city: string
  country: string // ISO code
}

interface BankAccount {
  accountHolder: string
  iban: string
  bic?: string
}

interface SellerVerification {
  fullName: string
  address: Address
  bankAccount: BankAccount
  acceptedTerms: boolean
  verifiedAt?: string
}

interface NotificationSettings {
  emailMessages: boolean
  emailOffers: boolean
  emailListingUpdates: boolean
  pushEnabled: boolean
  newsletter: boolean
}

interface PublicProfile {
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

type PasswordStrength = 'schwach' | 'mittel' | 'stark'
type VerificationStep = 1 | 2 | 3 | 4
```

## Validation Rules

### Email
- Valid email format
- Not already registered (on registration)

### Password
- Minimum 8 characters
- At least 1 number
- At least 1 special character

### IBAN
- Valid format per country (DE: 22 chars, AT: 20 chars)
- Check digit validation
- Auto-formatting (spaces every 4 chars)

### ZIP Code
- Country-specific validation
- DE: 5 digits
- AT: 4 digits
- CH: 4 digits

## Scope Exclusions

- User rating/review system
- Two-factor authentication
- Admin user management
- ID verification with document upload
- Business verification

## Acceptance Criteria

- [ ] Login form authenticates correctly
- [ ] Registration creates account with validation
- [ ] Social login buttons present (implementation depends on backend)
- [ ] Password strength indicator works
- [ ] Profile settings save correctly
- [ ] Notification preferences toggle work
- [ ] Password change validates and updates
- [ ] Password reset flow works
- [ ] Seller verification completes all 4 steps
- [ ] IBAN validation and formatting works
- [ ] Public profile displays correctly
- [ ] Dark mode fully supported

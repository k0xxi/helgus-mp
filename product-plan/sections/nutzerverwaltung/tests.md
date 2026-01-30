# Tests: Nutzerverwaltung

## Component Tests

### AuthPage

#### Rendering
- [ ] Shows tab switcher (Anmelden/Registrieren)
- [ ] Shows logo header
- [ ] Shows decorative background
- [ ] Shows footer with legal links

#### Tab Switching
- [ ] Default tab is login
- [ ] Clicking "Registrieren" switches to registration
- [ ] Clicking "Anmelden" switches to login
- [ ] Active tab is highlighted

### LoginForm

#### Rendering
- [ ] Email input field
- [ ] Password input with show/hide toggle
- [ ] "Angemeldet bleiben" checkbox
- [ ] Login button
- [ ] Social login buttons (Google, Apple)
- [ ] "Passwort vergessen?" link
- [ ] Link to registration

#### Validation
- [ ] Email required
- [ ] Email format validation
- [ ] Password required
- [ ] Error message displays on invalid

#### Interactions
- [ ] Show/hide password toggle works
- [ ] Login button calls onLogin with credentials
- [ ] Social button calls onSocialLogin with provider
- [ ] Forgot password link calls onForgotPassword
- [ ] Register link calls onRegister

#### States
- [ ] Loading state disables form
- [ ] Error message displayed from props
- [ ] Success redirects (via callback)

### RegistrationForm

#### Rendering
- [ ] Name input
- [ ] Email input
- [ ] Password input with strength indicator
- [ ] Password confirmation input
- [ ] Terms checkbox with link
- [ ] Privacy checkbox with link
- [ ] Register button
- [ ] Social login buttons
- [ ] Link to login

#### Password Strength
- [ ] "schwach" for < 8 chars or missing requirements
- [ ] "mittel" for 8+ chars with some requirements
- [ ] "stark" for all requirements met
- [ ] Visual indicator updates in real-time

#### Validation
- [ ] All fields required
- [ ] Email format validation
- [ ] Password: 8+ chars, 1 number, 1 special char
- [ ] Passwords must match
- [ ] Both checkboxes required

#### Interactions
- [ ] Register button calls onRegister with data
- [ ] Social button calls onSocialLogin
- [ ] Login link calls onLogin

### ProfileSettings

#### Tabs Rendering
- [ ] "Persönliche Daten" tab
- [ ] "Adresse & Standort" tab
- [ ] "Benachrichtigungen" tab
- [ ] "Sicherheit" tab

#### Personal Data Tab
- [ ] Avatar display/upload
- [ ] Name input
- [ ] Bio textarea
- [ ] Email input (with change verification note)
- [ ] Phone input

#### Address Tab
- [ ] Street input
- [ ] House number input
- [ ] ZIP input
- [ ] City input
- [ ] Country selector

#### Notifications Tab
- [ ] Toggle for email messages
- [ ] Toggle for email offers
- [ ] Toggle for email listing updates
- [ ] Toggle for push notifications
- [ ] Toggle for newsletter

#### Security Tab
- [ ] "Passwort ändern" button
- [ ] Connected accounts list
- [ ] Connect/disconnect account buttons
- [ ] "Konto löschen" button (red)

#### Interactions
- [ ] Save button calls onSaveProfile
- [ ] Password change calls onChangePassword
- [ ] Connect account calls onConnectAccount
- [ ] Disconnect calls onDisconnectAccount
- [ ] Delete account calls onDeleteAccount with confirmation

### PasswordReset

#### Request Mode
- [ ] Email input
- [ ] "Link senden" button
- [ ] Back to login link

#### Reset Mode
- [ ] New password input
- [ ] Password confirmation
- [ ] Strength indicator
- [ ] Save button

#### States
- [ ] Loading state
- [ ] Success message
- [ ] Error message

### ChangePassword

#### Rendering
- [ ] Current password input
- [ ] New password input with strength indicator
- [ ] Confirm new password input
- [ ] Save button
- [ ] Cancel button

#### Validation
- [ ] All fields required
- [ ] New password meets requirements
- [ ] Passwords match

### SellerVerificationForm

#### Step 1: Übersicht
- [ ] Benefits explanation
- [ ] Requirements list
- [ ] "Jetzt verifizieren" button

#### Step 2: Adressdaten
- [ ] Full name input
- [ ] Street input
- [ ] House number input
- [ ] ZIP input
- [ ] City input
- [ ] Country selector

#### Step 3: Bankdaten
- [ ] Account holder input
- [ ] IBAN input with formatting
- [ ] BIC input (optional)
- [ ] Disclaimer text

#### IBAN Validation
- [ ] Auto-formats with spaces
- [ ] Validates length by country
- [ ] Check digit validation
- [ ] Shows error for invalid

#### Step 4: Bestätigung
- [ ] Summary of all data
- [ ] Terms checkbox
- [ ] "Verifizierung abschließen" button

#### Success State
- [ ] Confirmation message
- [ ] Verified badge shown
- [ ] Next steps info

### PublicProfile

#### Rendering
- [ ] Large avatar
- [ ] Display name
- [ ] Verified badge (if applicable)
- [ ] "Mitglied seit" date
- [ ] Bio/description
- [ ] City/country
- [ ] "Nachricht senden" button
- [ ] Listings grid (max 6)
- [ ] "Alle Anzeigen anzeigen" if more

#### Interactions
- [ ] Message button calls onSendMessage
- [ ] Listing click calls onViewListing
- [ ] "Alle Anzeigen" calls onViewAllListings

## Integration Tests

### Login Flow
1. [ ] Enter valid credentials
2. [ ] Click login
3. [ ] Success callback called
4. [ ] Redirect to dashboard

### Registration Flow
1. [ ] Fill all fields correctly
2. [ ] Accept terms and privacy
3. [ ] Click register
4. [ ] Success message shown
5. [ ] Redirect to email verification prompt

### Password Reset Flow
1. [ ] Click "Passwort vergessen"
2. [ ] Enter email
3. [ ] Click "Link senden"
4. [ ] Success message shown
5. [ ] (Email link opens reset form)
6. [ ] Enter new password
7. [ ] Confirm password
8. [ ] Click save
9. [ ] Redirect to login

### Profile Update Flow
1. [ ] Navigate to profile settings
2. [ ] Update name
3. [ ] Click save
4. [ ] Success feedback
5. [ ] Data persisted

### Seller Verification Flow
1. [ ] Start verification from profile
2. [ ] Complete step 1 (overview)
3. [ ] Fill address in step 2
4. [ ] Fill bank details in step 3
5. [ ] Review and accept terms in step 4
6. [ ] Submit verification
7. [ ] Badge appears on profile

## Accessibility Tests

- [ ] Form fields have labels
- [ ] Error messages linked to inputs
- [ ] Password toggle has aria-label
- [ ] Step navigation keyboard accessible
- [ ] Focus management in multi-step forms
- [ ] Color contrast meets WCAG AA

## Responsive Tests

### Desktop
- [ ] Centered card layout
- [ ] Comfortable form width

### Tablet
- [ ] Slightly narrower card
- [ ] Full-width inputs

### Mobile
- [ ] Full-width forms
- [ ] Larger touch targets
- [ ] Stack tabs vertically (profile settings)

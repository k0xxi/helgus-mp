# Nutzerverwaltung

User registration, authentication, profile management, and seller verification.

## Components

| Component | Description |
|-----------|-------------|
| `AuthPage` | Combined login/registration page with tabs |
| `LoginForm` | Login form with social login options |
| `RegistrationForm` | Registration form with password strength |
| `ProfileSettings` | Profile management with tabs |
| `PasswordReset` | Password reset request and form |
| `ChangePassword` | In-app password change |
| `SellerVerificationForm` | Multi-step seller verification flow |
| `PublicProfile` | Public-facing user profile |

## Files

- `types.ts` - TypeScript interfaces
- `data.json` - Sample data
- `tests.md` - Test specifications
- `components/` - Component implementations

## Callbacks

### LoginForm
| Callback | Description |
|----------|-------------|
| `onLogin` | Submit login credentials |
| `onSocialLogin` | Social login (Google/Apple) |
| `onForgotPassword` | Navigate to password reset |
| `onRegister` | Switch to registration |

### RegistrationForm
| Callback | Description |
|----------|-------------|
| `onRegister` | Submit registration |
| `onSocialLogin` | Social login (Google/Apple) |
| `onLogin` | Switch to login |

### ProfileSettings
| Callback | Description |
|----------|-------------|
| `onSaveProfile` | Save profile changes |
| `onChangePassword` | Navigate to password change |
| `onStartVerification` | Start seller verification |
| `onConnectAccount` | Connect social account |
| `onDisconnectAccount` | Disconnect social account |
| `onDeleteAccount` | Delete user account |

### SellerVerificationForm
| Callback | Description |
|----------|-------------|
| `onComplete` | Submit verification |
| `onCancel` | Cancel verification |
| `onNextStep` | Navigate to next step |
| `onPrevStep` | Navigate to previous step |

### PublicProfile
| Callback | Description |
|----------|-------------|
| `onSendMessage` | Send message to user |
| `onViewListing` | View user's listing |
| `onViewAllListings` | View all user's listings |

## Design Decisions

- **Tab-Based Auth**: Login and registration on same page with tab switcher
- **Password Strength**: Visual indicator with German labels (schwach/mittel/stark)
- **IBAN Validation**: Auto-formatting with spaces, country-specific validation
- **Profile Tabs**: Separate concerns into Personal/Address/Notifications/Security
- **Verification Flow**: 4-step wizard with clear progress and summary
- **Public Profile**: Shows only safe-to-share information (city, not address)

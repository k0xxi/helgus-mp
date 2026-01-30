# Nutzerverwaltung

## Übersicht

Registrierung, Anmeldung, Profilverwaltung und Upgrade zum verifizierten Verkäufer mit Adresse und Bankdaten für Vorauskasse.

---

## Hauptansichten

### 1. Login
Anmeldeseite mit E-Mail/Passwort und Social-Login-Optionen.

**Elemente:**
- E-Mail-Eingabefeld
- Passwort-Eingabefeld (mit Anzeigen/Verbergen Toggle)
- "Angemeldet bleiben" Checkbox
- Login-Button
- Social-Login-Buttons (Google, Apple)
- Link zu "Passwort vergessen"
- Link zu Registrierung

### 2. Registrierung
Neue Nutzer-Registrierung mit mehreren Optionen.

**Elemente:**
- Name-Eingabefeld
- E-Mail-Eingabefeld
- Passwort-Eingabefeld (mit Stärke-Indikator)
- Passwort-Bestätigung
- AGB-Checkbox mit Link
- Datenschutz-Checkbox mit Link
- Registrieren-Button
- Social-Login-Buttons (Google, Apple)
- Link zu Login ("Bereits registriert?")

**Validierung:**
- E-Mail-Format prüfen
- Passwort mind. 8 Zeichen, 1 Zahl, 1 Sonderzeichen
- E-Mail-Verifizierung nach Registrierung

### 3. Profil-Einstellungen
Zentrale Verwaltung aller Nutzer-Informationen.

**Tabs/Abschnitte:**

#### Persönliche Daten
- Profilbild (Upload/Ändern)
- Anzeigename
- Bio/Beschreibung (optional)
- E-Mail (änderbar mit Verifizierung)
- Telefonnummer (optional)

#### Adresse & Standort
- Straße + Hausnummer
- PLZ + Ort (mit Länder-Auswahl wie im ListingForm)
- Land (DE, AT, CH, etc.)
- Standardstandort für Anzeigen

#### Benachrichtigungen
- E-Mail bei neuen Nachrichten (An/Aus)
- E-Mail bei Preisangeboten (An/Aus)
- E-Mail bei Anzeigen-Updates (An/Aus)
- Push-Benachrichtigungen (An/Aus)
- Newsletter (An/Aus)

#### Sicherheit
- Passwort ändern (Link zu Passwort-Änderung)
- Verbundene Konten (Google, Apple)
- Konto löschen

### 4. Passwort-Verwaltung

#### Passwort vergessen
- E-Mail-Eingabe
- "Link senden" Button
- Bestätigungsmeldung
- Link zurück zum Login

#### Passwort zurücksetzen (via E-Mail-Link)
- Neues Passwort eingeben
- Passwort bestätigen
- Stärke-Indikator
- Speichern-Button

#### Passwort ändern (eingeloggt)
- Aktuelles Passwort
- Neues Passwort
- Neues Passwort bestätigen
- Stärke-Indikator
- Speichern-Button

### 5. Verkäufer-Verifizierung (Upgrade)
Multi-Step-Flow zum Upgrade auf verifizierten Verkäufer.

**Schritt 1: Übersicht**
- Erklärung der Vorteile (Vertrauens-Badge, Vorauskasse-Option)
- Was wird benötigt (Adresse, Bankdaten)
- "Jetzt verifizieren" Button

**Schritt 2: Adressdaten**
- Vollständiger Name (wie auf Ausweis)
- Straße + Hausnummer
- PLZ + Ort
- Land
- Validierung der Adresse

**Schritt 3: Bankdaten**
- Kontoinhaber
- IBAN (mit Formatierung und Validierung)
- BIC (optional, wird automatisch ermittelt)
- Hinweis: "Wird nur für Vorauskasse-Zahlungen verwendet"

**Schritt 4: Bestätigung**
- Zusammenfassung aller Daten
- AGB für Verkäufer akzeptieren
- "Verifizierung abschließen" Button

**Nach Verifizierung:**
- Bestätigungsseite mit Erfolgs-Meldung
- Verifizierungs-Badge wird sofort angezeigt
- Vorauskasse-Option in Anzeigen verfügbar

### 6. Öffentliches Nutzerprofil
Profil-Ansicht für andere Nutzer.

**Elemente:**
- Profilbild (groß)
- Anzeigename
- "Mitglied seit" Datum
- Verifizierungs-Badge (falls verifiziert)
- Bio/Beschreibung
- Standort (nur Stadt, keine genaue Adresse)
- "Nachricht senden" Button

**Anzeigen-Liste:**
- Grid mit aktiven Anzeigen des Nutzers
- Produktkarten wie in Produktkatalog
- "Alle Anzeigen anzeigen" wenn mehr als 6

---

## Datentypen

### User
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
  verificationDate?: string
  notificationSettings: NotificationSettings
}
```

### Address
```typescript
interface Address {
  street: string
  houseNumber: string
  zip: string
  city: string
  country: string // ISO 3166-1 alpha-2
}
```

### SellerVerification
```typescript
interface SellerVerification {
  fullName: string
  address: Address
  bankAccount: BankAccount
  acceptedTerms: boolean
  verifiedAt?: string
}
```

### BankAccount
```typescript
interface BankAccount {
  accountHolder: string
  iban: string
  bic?: string
}
```

### NotificationSettings
```typescript
interface NotificationSettings {
  emailMessages: boolean
  emailOffers: boolean
  emailListingUpdates: boolean
  pushEnabled: boolean
  newsletter: boolean
}
```

---

## Interaktionen

| Aktion | Callback |
|--------|----------|
| Login absenden | `onLogin(email, password, rememberMe)` |
| Social Login | `onSocialLogin(provider: 'google' \| 'apple')` |
| Registrierung absenden | `onRegister(data: RegistrationData)` |
| Profil speichern | `onSaveProfile(data: Partial<User>)` |
| Passwort ändern | `onChangePassword(current, new)` |
| Passwort-Reset anfordern | `onRequestPasswordReset(email)` |
| Verifizierung starten | `onStartVerification()` |
| Verifizierung abschließen | `onCompleteVerification(data: SellerVerification)` |
| Nachricht senden (Profil) | `onSendMessage(userId)` |
| Anzeige anklicken (Profil) | `onViewListing(listingId)` |

---

## Zustände

### Login/Registrierung
- **idle**: Formular bereit
- **loading**: Anfrage wird verarbeitet
- **error**: Fehler anzeigen (z.B. "E-Mail bereits registriert")
- **success**: Weiterleitung

### Profil-Einstellungen
- **viewing**: Daten werden angezeigt
- **editing**: Felder sind editierbar
- **saving**: Änderungen werden gespeichert
- **saved**: Erfolgs-Feedback

### Verifizierung
- **not_started**: Noch nicht verifiziert
- **in_progress**: Im Verifizierungs-Flow (Schritt 1-4)
- **pending**: Warten auf Bestätigung (falls manuelle Prüfung)
- **verified**: Erfolgreich verifiziert
- **rejected**: Verifizierung abgelehnt (mit Grund)

---

## Validierung

### E-Mail
- Gültiges E-Mail-Format
- Bei Registrierung: Nicht bereits registriert

### Passwort
- Mindestens 8 Zeichen
- Mindestens 1 Zahl
- Mindestens 1 Sonderzeichen
- Stärke-Indikator: schwach/mittel/stark

### IBAN
- Gültiges IBAN-Format (DE: 22 Zeichen, AT: 20 Zeichen, etc.)
- Prüfziffer-Validierung
- Automatische Formatierung (Leerzeichen alle 4 Zeichen)

### Adresse
- PLZ-Validierung je nach Land (wie in Verkäufer-Dashboard)
- Alle Pflichtfelder ausgefüllt

---

## Außerhalb des Scopes

- Bewertungssystem für Nutzer (spätere Erweiterung)
- Zwei-Faktor-Authentifizierung
- Admin-Bereich für Nutzerverwaltung
- Identitätsprüfung mit Ausweis-Upload
- Gewerbenachweis für Händler

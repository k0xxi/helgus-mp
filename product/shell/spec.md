# Application Shell Specification

## Overview
Der HELGUS Marktplatz verwendet ein Hybrid-Shell-Design, das sich an den Nutzerkontext anpasst. Öffentliche Bereiche (Produktkatalog) nutzen eine Top-Navigation für einfaches Browsing, während der Verkäufer-Dashboard eine strukturiertere Sidebar-Navigation bietet.

## Navigation Structure

### Top Navigation (Öffentliche Bereiche)
- **Produktkatalog & Suche** → Hauptseite mit Produktübersicht
- **Kategorien** → Dropdown mit 10 Hauptkategorien
- **Anzeige erstellen** → CTA Button für neue Inserate (rot hervorgehoben)

### Dashboard Navigation (Verkäufer-Bereich)
- **Übersicht** → Dashboard-Startseite
- **Meine Anzeigen** → Verwaltung aktiver Inserate
- **Verkäufe** → Übersicht verkaufter Produkte
- **Nachrichten** → Kommunikation mit Käufern
- **Statistiken** → Verkaufsstatistiken

### User Menu
- **Mein Dashboard** → Wechsel zum Verkäufer-Dashboard (nur für Verkäufer)
- **Meine Anzeigen** → Schnellzugriff auf eigene Inserate
- **Profil & Einstellungen** → Nutzerverwaltung
- **Logout** → Abmelden

## Additional Navigation Items

### Icons & CTAs (Top Right)
- **Benachrichtigungen** (Bell Icon) → Badge mit Anzahl neuer Benachrichtigungen
- **Favoriten** (Heart Icon) → Gespeicherte/gemerkte Produkte
- **Anzeige erstellen** (Button) → Prominenter CTA in primärer Farbe (rot)
- **User Menu** (Avatar/Name) → Dropdown mit Nutzerfunktionen

### Suchleiste
- **Position:** Zentral in der Top-Navigation (Desktop), kompakt oben (Mobile)
- **Features:** PLZ-Umkreissuche, Kategorien-Filter, Auto-Suggest

## Layout Pattern

### Desktop (>1024px)
- Top Navigation mit Logo links, Suchleiste mittig, Icons und User-Menu rechts
- Vollbreiter Content-Bereich für Produktkatalog
- Verkäufer-Dashboard mit Sidebar links, Content rechts

### Tablet (768-1024px)
- Kompaktere Top-Navigation
- Icons ohne Text-Labels
- Angepasste Suchleiste

### Mobile (<768px)
- Minimale Top-Bar mit Logo und kompakter Suche
- Bottom Navigation Bar (fixiert) mit 5 Icons:
  - Home/Katalog
  - Suche
  - Anzeige erstellen (hervorgehoben)
  - Favoriten
  - Profil/Menu

## Responsive Behavior

- **Desktop:** Volle Top-Navigation mit allen Features sichtbar, breite Suchleiste
- **Tablet:** Komprimierte Navigation, Icons ohne Labels, mittelgroße Suchleiste
- **Mobile:** Minimale Top-Bar + Bottom Navigation Bar für Hauptfunktionen

## Design Notes

- Primary Color (rot) für CTA Buttons und aktive Zustände
- Secondary Color (blau) für Hover-States und Links
- Neutral (slate) für Hintergründe, Borders und Text
- DM Sans für Navigation-Items und Überschriften
- Inter für Beschreibungen und Hilfetext
- Icons von lucide-react für konsistentes Design
- Light/Dark Mode Support mit entsprechenden Variants
- Smooth Transitions für Hover und Active States
- Badge-Komponente für Notification Counter
- Dropdown-Animation für User-Menu (fade-in, slide-down)

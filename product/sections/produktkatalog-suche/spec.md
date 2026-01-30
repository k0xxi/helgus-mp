# Produktkatalog & Suche Specification

## Overview
Der Produktkatalog ist die Hauptseite des HELGUS Marktplatzes, wo Nutzer alle verfügbaren Produkte durchsuchen und filtern können. Die Seite ist öffentlich zugänglich (kein Login erforderlich zum Browsen) und bietet umfangreiche Filter- und Sortiermöglichkeiten für eine gezielte Produktsuche mit PLZ-Umkreissuche.

## User Flows
- User besucht Katalog und sieht alle Produkte im Grid-Layout
- User nutzt Filter-Sidebar (Kategorie, Preis, PLZ-Umkreis, Abholungsart, Zustand)
- User klickt "Filter anwenden" um Ergebnisse zu aktualisieren
- User kann mit "Filter zurücksetzen" alle Filter entfernen
- User ändert Sortierung (Neueste zuerst, Preis aufsteigend, Preis absteigend)
- User klickt Favoriten-Icon (Herz) um Produkt zu merken
- User klickt auf Produktkarte um zur Produktdetailseite zu navigieren
- Bei eigenen Produkten erscheinen Edit/Delete Icons auf den Karten
- Keine Ergebnisse: Nachricht mit Vorschlägen zum Anpassen der Filter

## UI Requirements

### Hero Section
- Badge "Produkte entdecken" (pill-style, rot)
- Große Überschrift "Alle Produkte" (DM Sans, bold)
- Beschreibungstext unter der Überschrift (Inter)

### Layout
- Two-Column Layout: Filter-Sidebar (links, ~300px) + Produkt-Grid (rechts, flex-grow)
- Responsive: Mobile gestacked, Desktop side-by-side
- Maximale Content-Breite für Lesbarkeit

### Filter-Sidebar
- Heading "Filter" mit Filter-Icon
- Suchfeld "Was suchst du?" für Produktname-Suche
- Kategorie-Dropdown mit 10 Hauptkategorien + Unterkategorien (Elektronik, Mode, Wohnen, Sport, Hobbys, Baby & Kinder, Garten & Werkzeug, Haustiere, Büro, Beauty & Gesundheit)
- Preis-Range: Zwei Number-Inputs (Von / Bis) in Euro
- Standort: PLZ Text-Input + Umkreis-Dropdown (10km, 25km, 50km, 100km, 200km)
- Abholungsart-Dropdown (Alle, Nur Abholung, Nur Versand)
- Zustand-Dropdown (Alle, Neu, Wie neu, Sehr gut, Gut, Akzeptabel)
- "Filter anwenden" Button (rot, prominent, full-width)
- "Filter zurücksetzen" Link (unterhalb, zentriert, kleiner Text)

### Produkt-Grid Header
- Ergebnis-Counter: "X Produkte gefunden" (links, grauer Text)
- Sortier-Dropdown (rechts): Neueste zuerst (default), Preis aufsteigend, Preis absteigend

### Produkt-Grid
- CSS Grid mit 2-3 Spalten (Desktop >1200px: 3, Tablet 768-1200px: 2, Mobile <768px: 1)
- Gap zwischen Karten (16-24px) für klare Trennung
- Auto-flow für dynamische Anzahl von Produkten

### Produktkarte
- Container: Weiße Card mit Border, Rounded Corners, Hover-Shadow
- Produktbild: 4:3 oder 16:9 Aspect Ratio, Object-fit cover, Fallback-Icon bei fehlendem Bild
- Favoriten-Icon: Herz-Outline (oben rechts über Bild), fill on hover/active
- Edit/Delete Icons: Nur sichtbar bei eigenen Produkten (oben rechts über Bild)
- Produkttitel: Bold, 2 Zeilen max mit Text-Ellipsis
- Preis: Euro-Symbol, Rot (Primary Color), Groß (text-2xl), Bold
- Zustand-Badge: Icon + Text, kleine Pill (Neu = grün, Wie neu = blau, Rest = grau)
- Abholungsart: Icon (Paket/Hand) + Text (Abholung / Versand / Beides)
- Kontakt-Option: Icon + Text wenn verfügbar (z.B. "Telefonischer Kontakt möglich")
- PLZ-Anzeige: Location-Icon + PLZ-Nummer
- Zeitstempel: Relativ formatiert ("vor 1 Std.", "vor 3 Tagen"), kleiner grauer Text
- "Neu" Badge: Kleines rotes Badge wenn Produkt <24h alt
- Hover-Effekt: Leichte Elevation (shadow-md → shadow-lg), Smooth Transition

### Empty State
- Icon (z.B. leere Box oder Lupe)
- Nachricht: "Keine Produkte gefunden" (groß, DM Sans)
- Hilfetext: "Versuchen Sie andere Filter oder erweitern Sie den Suchradius" (kleiner, grau)
- Optional: Button "Filter zurücksetzen" oder Vorschläge für populäre Kategorien

### Interaktionen
- Klick auf Produktkarte (außer Icons) → Navigation zu Produktdetailseite
- Klick auf Favoriten-Icon → Toggle Merkliste (Login-Modal wenn nicht eingeloggt)
- Klick auf Edit-Icon → Navigation zu Produkt-Bearbeiten-Seite
- Klick auf Delete-Icon → Bestätigungs-Modal "Möchten Sie dieses Produkt wirklich löschen?"
- Filter-Änderungen → URL-Parameter Updates (für Sharing/Bookmarking/Browser-Back)
- "Filter anwenden" → Scroll to top + Results update
- Sortierung-Änderung → Sofortige Neu-Sortierung ohne Reload

### Responsive Behavior
- **Desktop (>1024px)**: Sidebar links, 3-Spalten Grid
- **Tablet (768-1024px)**: Sidebar links (schmaler), 2-Spalten Grid
- **Mobile (<768px)**: Filter als Collapsible/Drawer, 1-Spalte Grid, größere Touch-Targets

## Configuration
- shell: true

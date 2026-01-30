# Data Model

## Entities

### User
Personen auf der Plattform, die entweder als Käufer (mit Basis-Registrierung) oder als verifizierte Verkäufer (mit zusätzlichen Informationen wie Adresse und Bankdaten) agieren.

### Product
Artikel, die auf dem Marktplatz verkauft werden. Enthält Informationen wie Bilder, Preis, Beschreibung, Zustand, und Optionen für Versand oder Selbstabholung.

### Category
Organisationsstruktur für Produkte mit 10 Hauptkategorien (z.B. Elektronik, Mode, Wohnen) und jeweils 10 Unterkategorien zur besseren Übersichtlichkeit.

### Message
Kommunikationsnachrichten zwischen Käufern und Verkäufern über ein bestimmtes Produkt, ermöglicht direkten Austausch und Klärung von Fragen.

### Offer
Gegenangebote, die Käufer an Verkäufer für ein Produkt senden können. Hat einen Status (ausstehend, akzeptiert, abgelehnt) und ermöglicht Preisverhandlungen.

### Notification
Push-Benachrichtigungen, die Benutzer über wichtige Events informieren, wie neue Gegenangebote, Nachrichten oder Statusänderungen.

## Relationships

- User erstellt viele Products (als Verkäufer)
- Product gehört zu einem User (dem Verkäufer)
- Product gehört zu einer Category
- Category enthält viele Products
- Message wird von einem User an einen anderen User gesendet und bezieht sich auf ein Product
- Offer wird von einem User (Käufer) an einen User (Verkäufer) für ein Product gesendet
- Notification wird an einen User gesendet

## Categories (10 Main + Subcategories)

1. **Elektronik** - Smartphones, Laptops, Tablets, Audio, Gaming, Foto, TV, Zubehör
2. **Mode** - Damen, Herren, Kinder, Schuhe, Taschen, Schmuck, Accessoires
3. **Wohnen** - Möbel, Dekoration, Küche, Bad, Textilien, Lampen, Aufbewahrung
4. **Sport** - Fitness, Outdoor, Wassersport, Wintersport, Radsport, Ballsport
5. **Hobbys** - Musik, Kunst, Sammeln, Basteln, Bücher, Filme, Spiele
6. **Baby & Kinder** - Kleidung, Spielzeug, Möbel, Kinderwagen, Schulbedarf
7. **Garten & Werkzeug** - Gartengeräte, Pflanzen, Werkzeug, Heimwerken, Outdoor-Möbel
8. **Haustiere** - Hunde, Katzen, Kleintiere, Vögel, Aquaristik, Zubehör
9. **Büro** - Schreibtische, Stühle, Technik, Organisation, Verbrauchsmaterial
10. **Beauty & Gesundheit** - Pflege, Kosmetik, Wellness, Medizinprodukte, Sport-Ernährung

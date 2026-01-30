# Produktdetails & Verhandlung Specification

## Overview
Detailansicht einzelner Produkte mit vollständiger Produktinformation, Bildergalerie, Gegenangebot-Funktion via Modal, integriertem Chat-System für Verkäufer-Kommunikation und Kaufanfrage-Workflow mit Push-Benachrichtigungen.

## User Flows
- Produktdetails ansehen (Bilder, Beschreibung, Zustand, Versandoptionen, Verkäufer-Info)
- Bildergalerie durchblättern via Thumbnails
- Gegenangebot erstellen über Modal-Dialog
- Nachricht an Verkäufer senden (Kontaktformular → Chat-Verlauf)
- Kaufanfrage senden (Verkäufer bestätigt, dann Zahlungsdetails)
- Produkt als Favorit speichern
- Produkt teilen
- Push-Benachrichtigungen im Notification-Center abrufen

## UI Requirements
- Bildergalerie mit klickbaren Thumbnails
- Breadcrumb-Navigation (Kategorie-Pfad)
- Preis prominent dargestellt, Zustand als Badge
- Versandoptionen-Karte
- Verkäufer-Karte mit Avatar, Name, Ort, Nachricht-Link
- Modal für Gegenangebot-Formular
- Chat-Ansicht mit Nachrichtenverlauf
- Notification-Center (Glocken-Icon mit Badge)
- Aktions-Buttons: Kaufen (primär), Favorit, Teilen

## Configuration
- shell: true

# Verkäufer-Dashboard Specification

## Overview
Das Verkäufer-Dashboard ist die zentrale Anlaufstelle für Verkäufer, um ihre Anzeigen zu erstellen und zu verwalten, Nachrichten von Käufern zu beantworten und den Status ihrer Verkäufe zu überblicken.

## User Flows
- Dashboard öffnen → Quick-Actions sehen → Schnellzugriff auf häufige Aktionen (Neue Anzeige, Nachrichten, Einstellungen)
- Anzeigen-Liste aufrufen → Karten-Grid mit allen eigenen Anzeigen durchsuchen → Anzeige bearbeiten/löschen/als verkauft markieren
- Neue Anzeige erstellen → Multi-Step-Formular durchlaufen (Basis-Infos → Bilder → Standort → Optionen) → Anzeige veröffentlichen
- Nachrichten-Inbox öffnen → Konversationen mit Käufern einsehen → Anfragen beantworten, Gegenangebote verhandeln
- Profil/Einstellungen bearbeiten → Persönliche Daten und Präferenzen anpassen

## UI Requirements
- Übersichts-Dashboard mit Quick-Action-Buttons für die wichtigsten Aktionen
- Anzeigen-Liste als Karten-Grid mit Produktbild, Titel, Preis und Status
- Multi-Step-Formular für Anzeigenerstellung mit Schritten: Basis-Infos, Bilder, Standort, Zusätzliche Optionen
- Nachrichten-Inbox mit Konversationsliste und Chat-Ansicht
- Formularfelder: Titel, Beschreibung, Kategorie, Preis, Bilder (mehrere), PLZ/Ort, Verhandlungsbasis, Versand möglich, Zustand

## Scope Exclusions
- Keine Zahlungsabwicklung
- Keine Werbung/Promotion-Features
- Keine Versandlabel-Integration

## Configuration
- shell: true

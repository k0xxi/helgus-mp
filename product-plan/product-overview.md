# HELGUS Marktplatz

## Product Summary

HELGUS Marktplatz ist ein optimierter Online-Marktplatz für den Kauf und Verkauf von Alltagsgegenständen in der Region. Mit integrierten Verhandlungstools, PLZ-Umkreissuche und gestaffelter Verkäufer-Verifizierung macht es den lokalen Handel einfach, sicher und effizient.

## Target Market

- Austrian/German-speaking market (DACH region)
- Local buyers and sellers of everyday items
- Focus on regional/proximity-based transactions

## Core Problems Solved

1. **Cluttered Marketplaces**: Clean, intuitive interface focused on essential features
2. **Awkward Price Negotiations**: Integrated counter-offer system with instant notifications
3. **Finding Nearby Items**: ZIP code radius search for local product discovery
4. **Trust Issues**: Tiered verification system (basic buyers vs. verified sellers)
5. **Unclear Payment/Shipping**: Structured process ensuring payment before shipping

## Key Features

- **Two-tier User Registration**: Basic (buyers) and Verified Sellers (with address and bank details)
- **ZIP Code Radius Search**: Local product discovery
- **10 Main Categories**: Electronics, Fashion, Home, Sports, Hobbies, Baby & Kids, Garden & Tools, Pets, Office, Beauty & Health
- **Product Cards**: Images, prices, "New" badges, and detailed info
- **Integrated Messaging**: Email or chat on product detail pages
- **Counter-Offer System**: Push notifications for sellers
- **Seller Dashboard**: Manage active listings, sold products, and communications
- **Flexible Fulfillment**: Self-pickup or shipping (with payment verification)

## Sections

| Section | Description |
|---------|-------------|
| **Produktkatalog & Suche** | Browse and discover products with ZIP radius search, category filters, and clear product cards |
| **Produktdetails & Verhandlung** | Detailed product view with messaging, counter-offer functionality, and push notifications |
| **Verkäufer-Dashboard** | Central hub for sellers to create/manage listings, track sales, and communicate with buyers |
| **Nutzerverwaltung** | Registration, profile management, upgrade to verified seller with address and bank details |

## Design System

| Token | Value |
|-------|-------|
| Primary Color | `red` (Tailwind) |
| Secondary Color | `blue` (Tailwind) |
| Neutral Color | `slate` (Tailwind) |
| Heading Font | DM Sans (Google Fonts) |
| Body Font | Inter (Google Fonts) |
| Mono Font | IBM Plex Mono (Google Fonts) |

## Data Model

### Entities

- **User**: Platform users (buyers or verified sellers with additional info)
- **Product**: Items for sale with images, price, description, condition, shipping options
- **Category**: 10 main categories with 10 subcategories each
- **Message**: Communication between buyers and sellers about specific products
- **Offer**: Counter-offers from buyers with status (pending/accepted/declined)
- **Notification**: Push notifications for important events

### Key Relationships

- User creates many Products (as seller)
- Product belongs to Category
- Message references Product and connects two Users
- Offer connects Buyer, Seller, and Product
- Notification is sent to User

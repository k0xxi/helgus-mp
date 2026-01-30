# Implementation Prompt: HELGUS Marktplatz

You are implementing **HELGUS Marktplatz**, a regional online marketplace for buying and selling everyday items. This is a React application with TypeScript and Tailwind CSS v4.

## Before You Start

Please ask me about:

1. **Tech Stack Preferences**
   - Which React framework? (Create React App, Vite, Next.js, Remix)
   - State management approach? (React Context, Zustand, Redux, etc.)
   - Routing library if not using Next.js? (React Router, TanStack Router)

2. **Backend/Authentication**
   - What backend will this connect to? (Supabase, Firebase, custom API, mock data)
   - Authentication method? (Email/password, OAuth providers, JWT)
   - How should I handle API calls? (fetch, axios, React Query, SWR)

3. **Deployment Target**
   - Where will this be deployed? (Vercel, Netlify, AWS, self-hosted)
   - Any specific requirements for SSR/SSG?

## Files to Review

Please read these files in order:

1. `product-plan/product-overview.md` - Product summary and features
2. `product-plan/instructions/one-shot-instructions.md` - Complete implementation guide
3. `product-plan/design-system/` - Colors, typography, tokens
4. `product-plan/data-model/` - Type definitions
5. `product-plan/shell/` - Navigation components
6. `product-plan/sections/` - Section components and tests

## Implementation Order

1. **Foundation** - Project setup, design tokens, types, routing
2. **Shell** - AppShell, MainNav, UserMenu
3. **Produktkatalog & Suche** - Product catalog with filters
4. **Produktdetails & Verhandlung** - Product details, chat, offers
5. **Verkäufer-Dashboard** - Seller dashboard, listing management
6. **Nutzerverwaltung** - Auth, profile, verification

## Key Requirements

- **Language**: German (Austrian market focus)
- **Dark Mode**: Full support with `dark:` variants
- **Mobile-First**: Responsive at all breakpoints
- **Props-Based**: All components receive data via props
- **Icons**: Use lucide-react
- **No tailwind.config.js**: Tailwind CSS v4 doesn't use it

## What to Build

Build all components as described in the instructions, wire them together with routing, and create pages that compose the components with mock data or connect to the backend based on your answers above.

Each section folder contains a `tests.md` file with TDD instructions - use these to validate your implementation.
